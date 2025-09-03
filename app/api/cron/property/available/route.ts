import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Property from '@/server/schema/Property';
import User from '@/server/schema/User';
import { dbConnection } from '@/lib/dbConnection';
import { sendEmail } from '@/actions/sendEmail';
import { NEXT_PUBLIC_BASE_URL } from '@/constants';
import { performance } from 'perf_hooks';

export async function GET(req: Request) {
  try {
    if (req.headers.get('vercel-cron') !== '1') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnection();
    const start = performance.now();

    const batchSize = 500;
    let processed = 0;

    // Track properties per agent for later summary
    const agentProps = new Map<string, { props: any[] }>();

    const cursor = Property.find({
      isAvailable: true,
      isDeleted: false,
      published: true,
    }).lean().batchSize(batchSize).cursor();

    for await (const prop of cursor) {
      const uid = String(prop.userId);
      if (!agentProps.has(uid)) agentProps.set(uid, { props: [] });
      agentProps.get(uid)!.props.push(prop);

      processed++;
      if (processed % batchSize === 0) await new Promise(r => setTimeout(r, 0));
    }

    const durationMs = performance.now() - start;
    const memEnd = process.memoryUsage();

    // Process aggregated per agent summary emails
    await Promise.all(
      Array.from(agentProps.entries()).map(async ([userId, { props }]) => {
        const agent = await User.findById(userId).lean<{ name: string; email?: string }>();
        if (!agent?.email) return;
        const stats = await Property.aggregate([
          { $match: { userId: new mongoose.Types.ObjectId(userId), isDeleted: false } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              published: { $sum: { $cond: ['$published', 1, 0] } },
              available: { $sum: { $cond: ['$isAvailable', 1, 0] } },
              views: { $sum: '$views' },
            },
          },
        ]);
        const s = stats[0] ?? { total: 0, published: 0, available: 0, views: 0 };
        const propTitles = props.map(p => `• ${p.title}`).join('\n');

        const message = `
Hello ${agent.name},

We noticed these listings still marked as available:
${propTitles}

Would you like Rentcreeb to help get them rented faster? Let us know!

📊 Your current figures:
Total Listings: ${s.total}
Published: ${s.published}
Available: ${s.available}
Total Views: ${s.views}

Thank you for using Rentcreeb!
`;

        await sendEmail({
          to: agent.email,
          name: agent.name,
          subject: 'Reminder: Listings still available — Rentcreeb can help',
          message,
          link: `${NEXT_PUBLIC_BASE_URL}/dashboard/properties`,
          linkDescription: 'Review all your listings',
        }).catch(err => console.error('Email send error for agent', userId, err));
      })
    );

    console.info(`Processed ${processed} props in ${durationMs.toFixed(0)}ms`);
    console.info(`Memory RSS: ${(memEnd.rss / 1024 / 1024).toFixed(1)}MB`);

    return NextResponse.json({
      success: true,
      processed,
      durationMs,
      memoryUsage: memEnd,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
