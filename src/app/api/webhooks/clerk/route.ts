import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const body = await req.text();

  const headerPayload = await headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let event: WebhookEvent;

  try {
    event = webhook.verify(body, svixHeaders) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }

  if (event.type === "user.created") {
    const user = event.data;

    await prisma.user.upsert({
      where: {
        clerkId: user.id,
      },
      update: {},
      create: {
        clerkId: user.id,
        email: user.email_addresses[0].email_address,
        username:
          user.username?.toLowerCase() ??
          user.email_addresses[0].email_address.split("@")[0],
        displayName: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
      },
    });

    console.log("Prisma user created");
  }

  return NextResponse.json({
    success: true,
  });
}
