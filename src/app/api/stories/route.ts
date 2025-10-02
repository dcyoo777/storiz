"use server";

import { auth } from "@/auth";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  // 세션 정보 가져오기
  const session = await auth();

  // 인증되지 않은 사용자 체크
  if (!session || !session.user || !session.user.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Log query parameters
  const searchParams = new URL(request.url).searchParams;

  console.log("Request URL:", request);

  const sql = neon(`${process.env.DATABASE_URL}`);

  const userQuery = await sql`
    SELECT id FROM users WHERE email = ${session.user.email}
  `;

  if (!userQuery || userQuery.length === 0) {
    throw new Error("User not found in database");
  }

  const actualUserId = userQuery[0].id;

  const result = await sql`
          SELECT * FROM stories WHERE user_id = ${actualUserId} ORDER BY created_at DESC
      `;

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
}
