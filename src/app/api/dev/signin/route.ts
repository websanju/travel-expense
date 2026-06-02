import { prisma } from "@/lib/prisma";
import { encode } from "next-auth/jwt";

const COOKIE_NAME = "next-auth.session-token";

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not allowed in production", {
      status: 403,
    });
  }

  const body = await req.json().catch(() => ({}));

  const email = body?.email;

  if (!email) {
    return new Response("email required", {
      status: 400,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return new Response("user not found", {
      status: 404,
    });
  }

  const maxAge = 60 * 60 * 24 * 7; // 7 days

  const token = await encode({
    token: {
      name: user.name ?? undefined,
      email: user.email,
      sub: user.id,
      exp: Math.floor(Date.now() / 1000) + maxAge,
    },
    secret: process.env.NEXTAUTH_SECRET!,
  });

  if (!token) {
    return new Response("failed to create token", {
      status: 500,
    });
  }

  const cookie =
    `${COOKIE_NAME}=${token}; ` +
    `Path=/; ` +
    `HttpOnly; ` +
    `SameSite=Lax; ` +
    `Max-Age=${maxAge}`;

  return new Response(
    JSON.stringify({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookie,
      },
    }
  );
}