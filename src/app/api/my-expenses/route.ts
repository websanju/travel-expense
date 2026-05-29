import { auth as getAuth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAuth();

  if (!session?.user?.email) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return new Response("User not found", {
      status: 404,
    });
  }

  const expenses = await prisma.expense.findMany({
    where: {
      userId: user.id,
    },
  });

  return Response.json(expenses);
}