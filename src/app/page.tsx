import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">Card Chaser</h1>

      <div className="flex gap-4 mt-6">
        <Link href="/search" className="bg-black text-white px-4 py-2 rounded">
          Search Cards
        </Link>

        <Link href="/chase" className="border px-4 py-2 rounded">
          My Chase List
        </Link>
      </div>
    </main>
  );
}
