import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <Link href="/new">
        <Button size="sm">Create New</Button>
      </Link>
    </div>
  );
}
