import { auth as getAuth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getAuth();

  // Not logged in
  if (!session?.user?.email) {
    return (
      <div className="max-w-xl mx-auto p-10">
        <h1 className="text-4xl font-bold mb-4">
          ✈️ Trip Invitation
        </h1>

        <p className="mb-6">
          Login to join this trip.
        </p>

        <Link
          href={`/login?trip=${id}`}
          className="
            bg-blue-600
            text-white
            px-5
            py-3
            rounded-xl
          "
        >
          Login & Join
        </Link>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const trip = await prisma.trip.findUnique({
    where: {
      id,
    },
  });

  if (!trip) {
    return <div>Trip not found</div>;
  }

  const existing =
    await prisma.tripParticipant.findFirst({
      where: {
        tripId: id,
        userId: user.id,
      },
    });

  if (!existing) {
    await prisma.tripParticipant.create({
      data: {
        tripId: id,
        userId: user.id,
        role: "member",
      },
    });
  }

  redirect(`/trips/${id}`);
}