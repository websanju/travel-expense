import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const member = await prisma.tripMember.create({
    data: {
      name: body.name,
      tripId: body.tripId,
    },
  });

  return Response.json(member);
}