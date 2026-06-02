import { auth as getAuth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import RecentExpenses from "@/components/dashboard/RecentExpenses";
import BottomNavigation from "@/components/dashboard/BottomNavigation";

export default async function DashboardPage() {
  const session = await getAuth();

  if (!session?.user?.email) {
    return (
      <div className="p-10">
        Unauthorized
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return (
      <div className="p-10">
        User not found
      </div>
    );
  }
type Trip = (typeof trips)[number];
type Expense = Trip["expenses"][number];

type RecentExpense = Expense & {
  tripTitle: string;
};


  const trips = await prisma.trip.findMany({
    where: {
      userId: user.id,
    },
    include: {
      members: true,
      expenses: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

const expenses: Expense[] = trips.flatMap(
  (trip: Trip) => trip.expenses
);

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

  const monthlyTotals: number[] = Array(12).fill(0);

  expenses.forEach((expense: Expense) => {
  const date = new Date(expense.expenseDate);

  const monthIndex = date.getMonth();

  monthlyTotals[monthIndex] += Number(
    expense.amount
  );
});

const chartData = months.map(
  (month, index) => ({
    month,
    amount: monthlyTotals[index],
  })
);

const totalTrips = trips.length;

const totalMembers = trips.reduce(
  (sum: number, trip: Trip) =>
    sum + trip.members.length,
  0
);
  
  const totalExpenseAmount = trips.reduce(
  (sum: number, trip: Trip) =>
    sum +
    trip.expenses.reduce(
      (
        expenseSum: number,
        expense: Expense
      ) =>
        expenseSum +
        Number(expense.amount),
      0
    ),
  0
);

  const recentExpenses: RecentExpense[] =
  trips
    .flatMap((trip: Trip) =>
      trip.expenses.map(
        (
          expense: Expense
        ): RecentExpense => ({
          ...expense,
          tripTitle: trip.title,
        })
      )
    )
    .sort(
      (
        a: RecentExpense,
        b: RecentExpense
      ) =>
        new Date(
          b.createdAt
        ).getTime() -
        new Date(
          a.createdAt
        ).getTime()
    )
    .slice(0, 10);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 pb-28 pt-[100px]">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_35%)] opacity-20" />

          <div className="relative z-10">
            <p className="text-white/80 text-sm font-medium">
              Welcome Back 👋
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
              {user.name}
            </h1>

            <p className="text-white/70 mt-3">
              Manage trips,
              expenses and
              settlements in one
              place.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          <div className="rounded-[18px] bg-gradient-to-br from-violet-500 to-purple-700 p-5 text-white shadow-xl">
            <div className="text-white/80 text-sm">
              Total Trips
            </div>

            <div className="text-4xl font-bold mt-3">
              {totalTrips}
            </div>
          </div>

          <div className="rounded-[28px] bg-gradient-to-br from-blue-500 to-cyan-500 p-5 text-white shadow-xl">
            <div className="text-white/80 text-sm">
              Members
            </div>

            <div className="text-4xl font-bold mt-3">
              {totalMembers}
            </div>
          </div>

          <div className="rounded-[28px] bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-white shadow-xl">
            <div className="text-white/80 text-sm">
              Expenses
            </div>

            <div className="text-3xl font-bold mt-3">
              ₹
              {totalExpenseAmount.toFixed(
                0
              )}
            </div>
          </div>

          <div className="rounded-[28px] bg-gradient-to-br from-orange-500 to-red-500 p-5 text-white shadow-xl">
            <div className="text-white/80 text-sm">
              Transactions
            </div>

            <div className="text-4xl font-bold mt-3">
              {
                recentExpenses.length
              }
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="mt-8 rounded-[32px] border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">
              Expense Analytics
            </h2>

            <span className="px-3 py-1 rounded-full text-xs bg-violet-500/20 text-violet-400">
              This Year
            </span>
          </div>

          <ExpenseChart
            data={chartData}
          />
        </div>

        {/* Recent Expenses */}
        <div className="mt-8">
          <RecentExpenses
            expenses={
              recentExpenses
            }
          />
        </div>

        {/* Recent Trips */}
        <div className="mt-8 rounded-[32px] border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Recent Trips
            </h2>

            <span className="text-zinc-500 text-sm">
              {trips.length} Trips
            </span>
          </div>

          {trips.length === 0 ? (
            <div className="text-zinc-500">
              No trips found
            </div>
          ) : (
            <div className="space-y-4">
              {trips.map(
                (trip: Trip) => (
                  <a
                    key={
                      trip.id
                    }
                    href={`/trips/${trip.id}`}
                    className="block rounded-[24px] border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-800 p-5 hover:border-purple-500 hover:-translate-y-1 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-xl">
                          {
                            trip.title
                          }
                        </h3>

                        <p className="text-zinc-400 mt-1">
                          {
                            trip.destination
                          }
                        </p>
                      </div>

                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        ✈️
                      </div>
                    </div>

                    <div className="flex gap-6 mt-5 text-sm text-zinc-400">
                      <div>
                        👥{" "}
                        {
                          trip
                            .members
                            .length
                        }
                      </div>

                      <div>
                        💳{" "}
                        {
                          trip
                            .expenses
                            .length
                        }
                      </div>
                    </div>
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </DashboardLayout>
  );
}