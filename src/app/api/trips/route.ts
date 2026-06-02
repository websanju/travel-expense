import { auth as getAuth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getAuth();

  if (!session?.user?.email) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return Response.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const trip = await prisma.trip.create({
    data: {
      title: body.title,
      destination: body.destination,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      userId: user.id,
    },
  });

  return Response.json(trip);
}