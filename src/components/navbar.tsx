import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav
      style={{
        borderBottom: "1px solid #e5e7eb",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          Card Chaser
        </Link>

        <div
          style={{
            display: "flex",
            gap: "32px",
            alignItems: "center",
          }}
        >
          <Link href="/search">Search Cards</Link>

          <Link href="/chase">My Chase List</Link>

          <Link href="/marketplace">Marketplace</Link>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <Show when="signed-out">
            <Link href="/sign-in">Sign In</Link>

            <Link href="/sign-up">Sign Up</Link>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </nav>
  );
}
