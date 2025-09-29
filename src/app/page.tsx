import Link from "next/link";
import Flex from "../components/custom/Flex";

export default function Home() {
  return (
    <Flex className="h-screen">
      <main>
        <Link
          href="/new"
          className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600"
        >
          Create New
        </Link>
      </main>
    </Flex>
  );
}
