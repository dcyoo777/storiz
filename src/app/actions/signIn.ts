"use server";

import { signIn } from "@/auth";

export const signInAction = async () => {
  const result = await signIn("google");
  console.log(result);
};
