"use server";

import { dbConnection } from "@/lib/dbConnection";
import { sendEmail } from "./sendEmail";
import Waitlist from "@/server/schema/WaitListModel";

export async function joinWaitlist(data: any) {
    await dbConnection();

    const existing = await Waitlist.findOne({
        email: data.email.toLowerCase(),
    });

    if (existing) {
        return {
            success: false,
            message: "This email has already joined the waitlist.",
        };
    }

    const waitlist = await Waitlist.create({
        ...data,
        email: data.email.toLowerCase(),
    });

    await Promise.all([
        sendEmail({
            to: data.email,
            template: "waitlist",
            subject: "🎉 You're on the RentCreeb 2.0 Waitlist!",
            data: {
                name: data.name,
            },
        }),

        sendEmail({
            to: "support@rentcreeb.com",
            template: "generic",
            subject: `New Waitlist Signup • ${data.name}`,
            data: {
                name: "RentCreeb Team",
                email: data.email,
                message: `
Name: ${data.name}

Email: ${data.email}

Phone: ${data.phone}

State: ${data.state}

LGA: ${data.lga}

City: ${data.city}

Interest: ${JSON.stringify(data.interest)}

I Am: ${data.iAm}

Message:
${data.message || "None"}
                `,
            },
        }),
    ]);

    return {
        success: true,
        data: waitlist,
    };
}