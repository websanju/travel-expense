import { auth as getAuth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const session = await getAuth();

  if (!session?.user?.email) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const user = await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      name: body.name,
      phone: body.phone,
      image: body.image,
    },
  });

  return Response.json(user);
}