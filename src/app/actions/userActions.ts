"use server";

import { neon } from "@neondatabase/serverless";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Find a user by email, or create a new user if they don't exist
 */
export async function findOrCreateUser(
  email: string,
  name: string | null,
  image: string | null,
  providerId: string,
): Promise<User> {
  const sql = neon(`${process.env.DATABASE_URL}`);

  // Check if user exists
  const existingUsers = await sql`
    SELECT id, email, name, image, created_at, updated_at
    FROM users
    WHERE email = ${email}
  `;

  if (existingUsers.length > 0) {
    // Update user info in case name or image changed
    const updated = await sql`
      UPDATE users
      SET name = ${name}, image = ${image}, updated_at = CURRENT_TIMESTAMP
      WHERE email = ${email}
      RETURNING id, email, name, image, created_at, updated_at
    `;
    return updated[0] as User;
  }

  // Create new user
  const newUsers = await sql`
    INSERT INTO users (id, email, name, image)
    VALUES (${providerId}, ${email}, ${name}, ${image})
    RETURNING id, email, name, image, created_at, updated_at
  `;

  return newUsers[0] as User;
}

/**
 * Get a user by their ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const sql = neon(`${process.env.DATABASE_URL}`);

  const users = await sql`
    SELECT id, email, name, image, created_at, updated_at
    FROM users
    WHERE id = ${userId}
  `;

  if (users.length === 0) {
    return null;
  }

  return users[0] as User;
}

/**
 * Get a user by their email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const sql = neon(`${process.env.DATABASE_URL}`);

  const users = await sql`
    SELECT id, email, name, image, created_at, updated_at
    FROM users
    WHERE email = ${email}
  `;

  if (users.length === 0) {
    return null;
  }

  return users[0] as User;
}
