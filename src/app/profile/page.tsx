import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
    include: {
      chaseItems: true,
      offers: true,
    },
  });

  if (!user) {
    return null;
  }

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
        My Profile
      </h1>
      <h1>{user.displayName}</h1>

      <p>
        Collection:
        {user.chaseItems.length}
      </p>

      <p>
        Offers:
        {user.offers.length}
      </p>
    </main>
  );
}
