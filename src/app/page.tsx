import { Button } from "@/components/ui/button";
import Link from "next/link";
import StoryList from "./components/StoryList";

export default function Home() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-4 p-4">
      <Link href="/new" className="fixed bottom-4">
        <Button size="sm">Create New</Button>
      </Link>
      <StoryList />
    </div>
  );
}
