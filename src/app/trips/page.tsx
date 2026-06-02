import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function TripsPage() {
  const trips = await prisma.trip.findMany({
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
            <h1 className="text-5xl font-bold tracking-tight">
              My Trips
            </h1>

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
          <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-12 text-center">
            <div className="text-6xl mb-4">
              ✈️
            </div>

            <h2 className="text-2xl font-bold">
              No Trips Yet
            </h2>

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
            {trips.map((trip: { id: string; title: string; destination: string }) => (
              <div
                key={trip.id}
                className="
                  group
                  bg-white
                  dark:bg-zinc-900
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  rounded-[32px]
                  p-6
                  shadow-sm
                  hover:shadow-2xl
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                {/* Top */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div
                      className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-gradient-to-br
                        from-violet-500
                        to-blue-500
                        flex
                        items-center
                        justify-center
                        text-2xl
                      "
                    >
                      ✈️
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold">
                        {trip.title}
                      </h2>

                      <p className="text-zinc-500 mt-1">
                        {trip.destination ||
                          "No destination"}
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-green-100
                      text-green-700
                      text-sm
                      font-medium
                    "
                  >
                    Active
                  </div>
                </div>

                {/* Info */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-4 text-center">
                    <div className="text-xs text-zinc-500">
                      Trip
                    </div>

                    <div className="font-bold mt-1">
                      Live
                    </div>
                  </div>

                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-4 text-center">
                    <div className="text-xs text-zinc-500">
                      Expenses
                    </div>

                    <div className="font-bold mt-1">
                      Track
                    </div>
                  </div>

                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-4 text-center">
                    <div className="text-xs text-zinc-500">
                      Status
                    </div>

                    <div className="font-bold mt-1">
                      ✓
                    </div>
                  </div>
                </div>

                {/* Actions */}
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
                      hover:scale-[1.02]
                      transition
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
                      hover:bg-zinc-100
                      dark:hover:bg-zinc-800
                      transition
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