import { prisma } from "@/lib/prisma";

export async function GET() {
  const expenses = await prisma.expense.findMany({
    where: {
      isPublic: true,
    },

    include: {
      trip: true,
    },
  });

  return Response.json(expenses);
}