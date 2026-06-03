import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request
) {
  const session =
    await auth();

  const { searchParams } =
    new URL(req.url);

  const phone =
    searchParams.get("phone");

  if (!phone) {
    return Response.json([]);
  }

  const users =
    await prisma.user.findMany({
      where: {
        phone: {
          contains: phone,
        },

        email: {
          not:
            session?.user?.email ??
            "",
        },
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },

      take: 10,
    });

  return Response.json(users);
}