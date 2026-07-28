import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Card Chaser
        </Link>

        <div className="flex gap-6">
          <Link href="/search" className="hover:underline">
            Search Cards
          </Link>

          <Link href="/chase" className="hover:underline">
            My Chase List
          </Link>

          <Link href="/marketplace" className="hover:underline">
            Marketplace
          </Link>
        </div>
      </div>
    </nav>
  );
}
