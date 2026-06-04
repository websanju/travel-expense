import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth as getAuth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function TripsPage() {
  const session = await getAuth();

  // Guest View
  if (!session?.user?.email) {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-[120px] pb-20">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600 p-10 md:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)] opacity-20" />

          <div className="relative z-10 text-center">
            <div className="text-7xl mb-6">✈️</div>

            <h1 className="text-5xl md:text-7xl font-bold text-white">
              Travel Expense
              <br />
              Manager
            </h1>

            <p className="text-white/80 text-xl mt-6 max-w-3xl mx-auto">
              Manage trips, split expenses, track budgets and settle payments
              with friends effortlessly.
            </p>

            <div className="flex justify-center gap-4 mt-10 flex-wrap">
              <Link
                href="/register"
                className="
                bg-white
                text-black
                px-8
                py-4
                rounded-2xl
                font-semibold
                hover:scale-105
                transition
              "
              >
                Get Started Free
              </Link>

              <Link
                href="/login"
                className="
                border
                border-white
                text-white
                px-8
                py-4
                rounded-2xl
                font-semibold
                hover:bg-white/10
                transition
              "
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="text-4xl mb-4">✈️</div>

            <h3 className="text-xl font-bold mb-2">Plan Trips</h3>

            <p className="text-zinc-400">
              Create unlimited trips and organize your travel plans.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="text-4xl mb-4">👥</div>

            <h3 className="text-xl font-bold mb-2">Add Friends</h3>

            <p className="text-zinc-400">
              Invite trip members and track shared expenses.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="text-4xl mb-4">💰</div>

            <h3 className="text-xl font-bold mb-2">Track Expenses</h3>

            <p className="text-zinc-400">
              Record hotels, food, transport and shopping.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="text-4xl mb-4">⚖️</div>

            <h3 className="text-xl font-bold mb-2">Split Bills</h3>

            <p className="text-zinc-400">
              Automatically calculate settlements for everyone.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-14">
          <h2 className="text-4xl font-bold text-center">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-6 mt-10">
            <div className="bg-zinc-900 rounded-3xl p-6 text-center">
              <div className="text-5xl mb-4">1️⃣</div>

              <h3 className="font-bold text-xl">Create Trip</h3>

              <p className="text-zinc-400 mt-2">
                Add destination and trip details.
              </p>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-6 text-center">
              <div className="text-5xl mb-4">2️⃣</div>

              <h3 className="font-bold text-xl">Add Members</h3>

              <p className="text-zinc-400 mt-2">
                Invite friends joining the trip.
              </p>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-6 text-center">
              <div className="text-5xl mb-4">3️⃣</div>

              <h3 className="font-bold text-xl">Add Expenses</h3>

              <p className="text-zinc-400 mt-2">
                Track every payment made during travel.
              </p>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-6 text-center">
              <div className="text-5xl mb-4">4️⃣</div>

              <h3 className="font-bold text-xl">Settle Up</h3>

              <p className="text-zinc-400 mt-2">
                Get instant settlement calculations.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-5 mt-14">
          <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-3xl p-6 text-center">
            <div className="text-5xl font-bold text-white">∞</div>

            <div className="text-white/70 mt-2">Trips</div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-6 text-center">
            <div className="text-5xl font-bold text-white">👥</div>

            <div className="text-white/70 mt-2">Members</div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-6 text-center">
            <div className="text-5xl font-bold text-white">💰</div>

            <div className="text-white/70 mt-2">Expenses</div>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl p-6 text-center">
            <div className="text-5xl font-bold text-white">⚡</div>

            <div className="text-white/70 mt-2">Settlements</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 text-center">
          <h2 className="text-4xl font-bold">Ready For Your Next Trip?</h2>

          <p className="text-zinc-400 mt-3">
            Start tracking travel expenses in less than 2 minutes.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <Link
              href="/register"
              className="
              bg-purple-600
              px-8
              py-3
              rounded-2xl
              text-white
              font-semibold
            "
            >
              Create Free Account
            </Link>

            <Link
              href="/login"
              className="
              border
              border-zinc-700
              px-8
              py-3
              rounded-2xl
              font-semibold
            "
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in User View
  // const trips = await prisma.trip.findMany({
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const trips = await prisma.trip.findMany({
    where: {
      participants: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      members: true,
      expenses: true,
      participants: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="pt-[10px]">
      <div className="max-w-7xl mx-auto p-6 pb-28 pt-[100px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">My Trips</h1>

            <p className="text-zinc-500 mt-2">
              Manage your journeys, expenses and settlements.
            </p>
          </div>

          <Link
            href="/trips/new"
            className="
              mt-4 md:mt-0
              px-6 py-3
              rounded-2xl
              bg-gradient-to-r
              from-violet-600
              to-blue-600
              text-white
              font-semibold
              shadow-lg
              hover:scale-105
              transition-all
            "
          >
            + Create Trip
          </Link>
        </div>

        {/* Empty State */}
        {trips.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-[12px] p-12 text-center">
            <div className="text-6xl mb-4">✈️</div>

            <h2 className="text-2xl font-bold">No Trips Yet</h2>

            <p className="text-zinc-500 mt-3">
              Create your first trip and start tracking expenses.
            </p>

            <Link
              href="/trips/new"
              className="
                inline-block
                mt-6
                px-6 py-3
                rounded-2xl
                bg-gradient-to-r
                from-violet-600
                to-blue-600
                text-white
                font-semibold
              "
            >
              Create Trip
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {trips.map((trip: any) => (
              <div
                key={trip.id}
                className="
                    group
                    bg-white
                    dark:bg-zinc-900
                    border
                    border-zinc-200
                    dark:border-zinc-800
                    rounded-3xl
                    border border-zinc-800
                    bg-zinc-900
                    p-3
                    transition-all
                    duration-300
                  "
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-2xl">
                      ✈️
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold">{trip.title}</h2>

                      <p className="text-zinc-500 mt-1">
                        {trip.destination || "No destination"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`
    px-3 py-1 rounded-full text-sm font-medium
    ${
      trip.expenses.length > 0
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }
  `}
                  >
                    {trip.expenses.length > 0 ? "Active" : "Planning"}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-2 text-center">
                    <div className="text-xs text-zinc-500">Trip</div>

                    <div className="font-bold mt-1">
                      👥 {trip.participants.length}
                    </div>
                  </div>

                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-2 text-center">
                    <div className="text-xs text-zinc-500">Expenses</div>

                    <div className="font-bold mt-1">
                      💳 {trip.expenses.length}
                    </div>
                  </div>

                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-2 text-center">
                    <div className="text-xs text-zinc-500">Status</div>

                    <div className="font-bold mt-1">
                      ₹
                      {trip.expenses.reduce(
                        (sum: number, expense: any) =>
                          sum + Number(expense.amount),
                        0,
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/trips/${trip.id}`}
                    className="
                        flex-1
                        text-center
                        py-3
                        rounded-2xl
                        bg-gradient-to-r
                        from-blue-600
                        to-blue-500
                        text-white
                        font-semibold
                      "
                  >
                    Open Trip
                  </Link>

                  <Link
                    href={`/trips/${trip.id}`}
                    className="
                        flex-1
                        text-center
                        py-3
                        rounded-2xl
                        border
                        border-zinc-300
                        dark:border-zinc-700
                        font-semibold
                      "
                  >
                    Members
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
