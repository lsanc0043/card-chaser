import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        padding: "10px 20px",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 700,
          marginBottom: "10px",
        }}
      >
        Card Chaser
      </h1>

      <div
        style={{
          display: "flex",
          gap: "16px",
        }}
      >
        <Link
          href="/search"
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Search Cards
        </Link>

        <Link
          href="/chase"
          style={{
            border: "1px solid #d1d5db",
            padding: "8px 16px",
            borderRadius: "6px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          My Chase List
        </Link>
      </div>
    </main>
  );
}
