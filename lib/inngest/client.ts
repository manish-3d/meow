import { Inngest } from "inngest";

const isPlaceholder = (val?: string) =>
  !val || val.includes("your_inngest") || val.trim() === "";

// Create an Inngest client to send and receive events
export const inngest = new Inngest({
  id: "meow-bot",
  ...(isPlaceholder(process.env.INNGEST_EVENT_KEY)
    ? {}
    : { eventKey: process.env.INNGEST_EVENT_KEY }),
});
