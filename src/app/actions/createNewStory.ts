"use server";

import { z } from "zod";
import { neon } from "@neondatabase/serverless";
import { storyFormSchema } from "../schema/storySchema";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// 플러그인 로드
dayjs.extend(utc);
dayjs.extend(timezone);

export const createNewStoryAction = async (
  values: z.infer<typeof storyFormSchema>,
) => {
  console.log(values);
  console.log(`${process.env.DATABASE_URL}`);

  // Connect to the Neon database
  const sql = neon(`${process.env.DATABASE_URL}`);
  const { title, description, startAt, endAt } = values;

  // Tagged Template Literal 방식
  const result = await sql`
        INSERT INTO stories (title, description, start_at, end_at, user_id) 
        VALUES (${title}, ${description}, ${dayjs(startAt).utc().toISOString()}, ${dayjs(endAt).utc().toISOString()}, ${uuidv4()}) 
        RETURNING id
    `;

  console.log("Insert result:", result);
  return result;
};
