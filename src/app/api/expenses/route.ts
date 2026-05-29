import { auth as getAuth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getAuth();
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { title, amount, category, isPublic, tripId } = body;

  if (!title || !amount) {
    return new Response("title and amount required", { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return new Response("User not found", { status: 404 });

  try {
    let tripToConnectId: string | undefined = tripId ? String(tripId) : undefined;

    if (!tripToConnectId) {
      // create a default trip for this user to satisfy relation requirements
      const trip = await prisma.trip.create({
        data: {
          title: `Default Trip ${Date.now()}`,
          destination: "",
          startDate: new Date(),
          endDate: new Date(),
          isPublic: false,
          user: { connect: { id: user.id } },
        },
      });
      tripToConnectId = trip.id;
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: Number(amount),
        category: category || "",
        isPublic: Boolean(isPublic),
        expenseDate: new Date(),
        user: { connect: { id: user.id } },
        trip: { connect: { id: tripToConnectId } },
      },
    });

    return Response.json(expense);
  } catch (err: any) {
    return new Response(String(err?.message || err), { status: 500 });
  }
}
