import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "InterviewX", // unique app ID
  name: "InterviewX",
  credentials: {
    groq: {
      apiKey: process.env.GROQ_API_KEY,
    },
  },
});