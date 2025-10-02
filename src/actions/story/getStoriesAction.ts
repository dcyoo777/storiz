"use server";

import { neon } from "@neondatabase/serverless";
import { auth } from "@/auth";
import { Story } from "@/types/story";

export const getStoriesAction = async (): Promise<Story[]> => {
  // Check authentication
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized: You must be logged in to create a story");
  }

  // Connect to the Neon database
  const sql = neon(`${process.env.DATABASE_URL}`);

  const result = await sql`
          SELECT * FROM stories WHERE user_id = ${session.user.id} ORDER BY created_at ASC
      `;

  return (result as Story[]) || [];
};
