import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import client from "./lib/mongodb";
import { sendEmail } from "./actions/sendEmail";
import { admin } from "better-auth/plugins";
import ShortUniqueId from "short-unique-id";
import User from "./server/schema/User";
import { dbConnection } from "./lib/dbConnection";

const uid = new ShortUniqueId({ length: 5 });

await client.connect();
const db = client.db();

export const auth = betterAuth({
  
  database: mongodbAdapter(db),
  emailAndPassword: { 
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        name: user.name,
        subject: "Reset your password",
        link: url,
        message: "Click to reset your password",
        linkDescription: "Reset Password",
      });
    }
},
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      prompt: "select_account",
      mapProfileToUser: async (profile: any) => ({
        name: profile.name,
        email: profile.email,
        username: await generateUsername(profile.email)
      })
    },
    facebook: { 
        clientId: process.env.AUTH_FACEBOOK_ID as string, 
        clientSecret: process.env.AUTH_FACEBOOK_SECRET as string,
        mapProfileToUser: async (profile: any) => ({
        name: profile.name,
        email: profile.email,
        username: await generateUsername(profile.email)
      })
    },
  },
  user: {
    additionalFields: {
      username: { type: "string", required: false, unique: true, input: true },
      phone: { type: "string", required: false, defaultValue: '' },
      whatsapp: { type: "string", required: false, defaultValue: '' },
      gender: { type: "string", required: false, defaultValue: "" },
      role: { type: "string", required: false, defaultValue: "" },
    },
    changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async ({ user, newEmail, url, token }, request) => {
              await sendEmail({
                to: user.email, 
                name: user.name, 
                subject: 'Change your email address', 
                link: url, 
                message: 'Please click on the link to verify your email',
                linkDescription: 'Confirm Email change'
            });
            },
        }
  },
  session: {
    
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60*60,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ( { user, url, token }, request) => {
      await sendEmail({
        to: user.email, 
        name: user.name, 
        subject: 'Verify your email address', 
        link: url, 
        message: 'Please click on the link to verify your email',
        linkDescription: 'Confirm Email'
    });
    },
  },
  plugins: [
   admin(),
  ],
});

 
export async function generateUsername(email: string): Promise<string> {
  const base = email.split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ''); // remove special chars

  let username = `${base}-${uid.randomUUID()}`;

  // Ensure it's unique
  await dbConnection()
  while (await User.findOne({ username })) {
    username = `${base}-${uid.randomUUID()}`;
  }

  return username;
}