import { z } from "zod";

export const storyFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2).max(100).optional(),
  startAt: z.string().min(2).max(100),
  endAt: z.string().min(2).max(100),
});
