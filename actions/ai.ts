"use server"

import { errorMessage } from '@/constants';
import { NewPropertySchemaType } from '@/sections/dashboard/formSchemas';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// export const config = {
//   maxDuration: 60,
// };


export async function generatePropertyDescription({
  description,
  property,
}: {
  description: string;
  property?: string;
}) {
  try {
    if (!description || description.length < 20)
      throw new Error('invalid request.');

    const prompt = `
      Using the following property data: ${JSON.stringify(property)},
      and the current description: "${description}",
      rewrite the property description to be more polished, detailed, and professionally written.
      Ensure it clearly highlights the key features of the property and is easy for potential renters or buyers to understand. and only return the details nothing more, strictly the details alone
    `;

    const newDescription = await tryGenerateContentWithRetry(prompt);
    return {
      success: true,
      message: '',
      data: newDescription,
    };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}


async function tryGenerateContentWithRetry(prompt: string, retries = 3, delay = 1000): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      const dataRes = await model.generateContent([prompt]);
      return await dataRes.response.text();
    } catch (err: any) {
      if (i === retries - 1) throw err;
      // Only retry on 503 or network errors
      if (err.message.includes("503") || err.message.includes("overloaded")) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1))); // Exponential backoff
      } else {
        throw err; // Don't retry for other errors
      }
    }
  }
  throw new Error("Failed to generate content after multiple attempts.");
}
