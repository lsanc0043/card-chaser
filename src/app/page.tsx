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
          href="/browse"
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Browse Cards
        </Link>
      </div>
    </main>
  );
}
