import { prisma } from "@/lib/prisma";
import AddMember from "@/components/AddMember";
import DeleteTripButton from "@/components/DeleteTripButton";
import AddExpense from "@/components/AddExpense";
import Link from "next/link";
import { auth as getAuth } from "@/auth";
export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold text-red-500">
          Trip ID Missing
        </h1>
      </div>
    );
  }

  
const session = await getAuth();

if (!session?.user?.email) {
  return <div>Unauthorized</div>;
}

const user = await prisma.user.findUnique({
  where: {
    email: session.user.email,
  },
});

if (!user) {
  return <div>User not found</div>;
}

const trip = await prisma.trip.findFirst({
  where: {
    id,
    userId: user.id,
  },
  include: {
    members: true,
    expenses: {
      include: {
        paidBy: true,
      },
    },
  },
});

if (!trip) {
  return (
    <div className="p-10">
      Trip not found
    </div>
  );
}
  // const trip = await prisma.trip.findUnique({
  //   where: {
  //     id,
  //   },
  //   include: {
  //     members: true,
  //     expenses: {
  //       include: {
  //         paidBy: true,
  //       },
  //     },
  //   },
  // });

  // if (!trip) {
  //   return (
  //     <div className="p-10">
  //       <h1 className="text-2xl font-bold">
  //         Trip not found
  //       </h1>
  //     </div>
  //   );
  // }

const totalExpense = trip.expenses.reduce(
  (sum: number, expense: { amount: number }) =>
    sum + expense.amount,
  0
);

  const memberCount = trip.members.length;

  const perPerson =
    memberCount > 0
      ? totalExpense / memberCount
      : 0;

  return (
  <div className="max-w-7xl mx-auto p-6 pt-[100px] pb-28">

    {/* Hero */}
    <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-[32px] p-8 text-white mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-bold">
            {trip.title}
          </h1>

          <p className="mt-2 text-white/80">
            {trip.destination || "No destination"}
          </p>
        </div>

        <div className="text-6xl">
          ✈️
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
          <div className="text-sm text-white/70">
            Total Expense
          </div>

          <div className="text-2xl font-bold">
            ₹{totalExpense.toFixed(0)}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
          <div className="text-sm text-white/70">
            Members
          </div>

          <div className="text-2xl font-bold">
            {memberCount}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
          <div className="text-sm text-white/70">
            Per Person
          </div>

          <div className="text-2xl font-bold">
            ₹{perPerson.toFixed(0)}
          </div>
        </div>
      </div>
    </div>

    {/* Actions */}
    <div className="grid lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-6">
        <AddMember tripId={trip.id} />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-6">
        <AddExpense
          tripId={trip.id}
          members={trip.members}
        />
      </div>
    </div>

    {/* Members */}
    <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 mb-8">
      <h2 className="text-2xl font-bold mb-5">
        👥 Members
      </h2>

      {trip.members.length === 0 ? (
        <div className="text-zinc-500">
          No members yet
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {trip.members.map((member: { id: string; name: string }) => (
            <div
              key={member.id}
              className="bg-zinc-800 rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center font-bold">
                {member.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <div className="font-semibold">
                  {member.name}
                </div>

                <div className="text-xs text-zinc-500">
                  Trip Member
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Expenses */}
    <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 mb-8">
      <h2 className="text-2xl font-bold mb-5">
        💰 Expenses
      </h2>

      {trip.expenses.length === 0 ? (
        <div className="text-zinc-500">
          No expenses yet
        </div>
      ) : (
        <div className="space-y-4">
          {trip.expenses.map(
            (expense: { id: string; title: string; amount: string; category: string; paidBy: { name: string } | null }) => (
              <div
                key={expense.id}
                className="bg-zinc-800 rounded-2xl p-5 flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-lg">
                    {expense.title}
                  </div>

                  <div className="text-sm text-zinc-500">
                    {expense.category}
                  </div>

                  <div className="text-xs text-zinc-400 mt-1">
                    Paid by{" "}
                    {expense.paidBy?.name ??
                      "Unknown"}
                  </div>
                </div>

                <div className="text-2xl font-bold text-green-400">
                  ₹{expense.amount}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>

    {/* Actions */}
    <div className="flex flex-wrap gap-4">
      <Link
        href={`/trips/${trip.id}/settlement`}
        className="
          px-6
          py-3
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-cyan-500
          text-white
          font-semibold
        "
      >
        View Settlement
      </Link>

      <DeleteTripButton
        tripId={trip.id}
      />
    </div>
  </div>
);
}