"use server";

import { signIn, signOut } from "@/auth";

export const signInAction = async () => {
  signIn("google");
};

export const signOutAction = async () => {
  signOut({ redirectTo: "/" });
};
