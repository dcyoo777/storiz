import { signInAction, signOutAction } from "@/actions/authAction";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export async function HeaderAuth() {
  const session = await auth();

  if (!session?.user) {
    return (
      <form action={signInAction}>
        <Button type="submit">Sign In</Button>
      </form>
    );
  }

  console.log("HeaderAuth Session :: ", session);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="text-sm">
          {session.user.name || session.user.email}
        </span>
      </div>
      <form action={signOutAction}>
        <Button type="submit" variant="outline">
          Sign Out
        </Button>
      </form>
    </div>
  );
}
