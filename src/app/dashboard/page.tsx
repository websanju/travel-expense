import { auth as getAuth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import RecentExpenses from "@/components/dashboard/RecentExpenses";
import BottomNavigation from "@/components/dashboard/BottomNavigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getAuth();

  if (!session?.user?.email) {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-[120px]">
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600 p-10 md:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)] opacity-20" />

          <div className="relative z-10 text-center">
            <div className="text-6xl mb-6">✈️</div>

            <h1 className="text-5xl font-bold text-white">
              Travel Expense Manager
            </h1>

            <p className="text-white/80 text-xl mt-5 max-w-2xl mx-auto">
              Track trip expenses, split bills with friends, manage settlements
              and keep your travel budget under control.
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <a
                href="/login"
                className="bg-white text-black px-6 py-3 rounded-2xl font-semibold"
              >
                Login
              </a>

              <a
                href="/register"
                className="border border-white text-white px-6 py-3 rounded-2xl font-semibold"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="text-4xl mb-4">👥</div>

            <h3 className="text-xl font-bold mb-2">Manage Members</h3>

            <p className="text-zinc-400">
              Add friends and track expenses for every traveler.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="text-4xl mb-4">💰</div>

            <h3 className="text-xl font-bold mb-2">Track Expenses</h3>

            <p className="text-zinc-400">
              Record hotels, food, fuel, shopping and transport costs.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="text-4xl mb-4">⚖️</div>

            <h3 className="text-xl font-bold mb-2">Auto Settlement</h3>

            <p className="text-zinc-400">
              Instantly calculate who owes whom after the trip.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return <div className="p-10">User not found</div>;
  }
  type Trip = (typeof trips)[number];
  type Expense = Trip["expenses"][number];

  type RecentExpense = Expense & {
    tripTitle: string;
  };

  const trips = await prisma.trip.findMany({
    where: {
      OR: [
        {
          userId: user.id,
        },
        {
          participants: {
            some: {
              userId: user.id,
            },
          },
        },
      ],
    },

    include: {
      members: true,

      participants: {
        include: {
          user: true,
        },
      },

      expenses: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const expenses: Expense[] = trips.flatMap((trip: Trip) => trip.expenses);

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

    monthlyTotals[monthIndex] += Number(expense.amount);
  });

  const chartData = months.map((month, index) => ({
    month,
    amount: monthlyTotals[index],
  }));

  const totalTrips = trips.length;

  const totalMembers = trips.reduce(
    (sum: number, trip: Trip) => sum + trip.participants.length,
    0,
  );

  const totalExpenseAmount = trips.reduce(
    (sum: number, trip: Trip) =>
      sum +
      trip.expenses.reduce(
        (expenseSum: number, expense: Expense) =>
          expenseSum + Number(expense.amount),
        0,
      ),
    0,
  );

  const recentExpenses: RecentExpense[] = trips
    .flatMap((trip: Trip) =>
      trip.expenses.map(
        (expense: Expense): RecentExpense => ({
          ...expense,
          tripTitle: trip.title,
        }),
      ),
    )
    .sort(
      (a: RecentExpense, b: RecentExpense) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 pb-28 pt-[100px]">
        {/* Hero */}
<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 p-6">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_35%)] opacity-20" />

  <div className="relative z-10">
    <p className="text-white/70 text-sm">
      Welcome Back 👋
    </p>

    <h1 className="text-3xl font-bold text-white mt-1">
      {user.name}
    </h1>

    <p className="text-white/70 text-sm mt-2">
      Manage trips, expenses and settlements.
    </p>

    <div className="flex gap-6 mt-5 text-sm text-white/80">
      <div>
        <div className="font-semibold">
          {totalTrips}
        </div>
        <div>Trips</div>
      </div>

      <div>
        <div className="font-semibold">
          {totalMembers}
        </div>
        <div>Members</div>
      </div>
    </div>
  </div>
</div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          {/* <div className="rounded-[18px] bg-gradient-to-br from-violet-500 to-purple-700 p-5 text-white shadow-xl">
            <div className="text-white/80 text-sm">Total Trips</div>

            <div className="text-4xl font-bold mt-3">{totalTrips}</div>
          </div>

          <div className="rounded-[28px] bg-gradient-to-br from-blue-500 to-cyan-500 p-5 text-white shadow-xl">
            <div className="text-white/80 text-sm">Members</div>

            <div className="text-4xl font-bold mt-3">{totalMembers}</div>
          </div> */}

          {totalExpenseAmount > 0 && (
  <div className="rounded-[28px] bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-white shadow-xl">
    <div className="text-white/80 text-sm">
      Expenses
    </div>

    <div className="text-3xl font-bold mt-3">
      ₹{totalExpenseAmount.toFixed(0)}
    </div>
  </div>
)}

         {recentExpenses.length > 0 && (
  <div className="rounded-[28px] bg-gradient-to-br from-orange-500 to-red-500 p-5 text-white shadow-xl">
    <div className="text-white/80 text-sm">
      Transactions
    </div>

    <div className="text-4xl font-bold mt-3">
      {recentExpenses.length}
    </div>
  </div>
)}
        </div>

        {/* Analytics */}
        {totalExpenseAmount > 0 && (
            <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                    Expense Analytics
                </h2>

                <span className="text-xs text-zinc-400">
                    This Year
                </span>
                </div>

                <ExpenseChart
                data={chartData}
                />
            </div>
            )}

        {/* Recent Expenses */}
        <div className="mt-8">
          <RecentExpenses expenses={recentExpenses} />
        </div>

        {/* Recent Trips */}
        <div className="mt-8 rounded-[32px] border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Trips</h2>

            <span className="text-zinc-500 text-sm">{trips.length} Trips</span>
          </div>

          {trips.length === 0 ? (
            <div className="text-zinc-500">No trips found</div>
          ) : (
            <div className="space-y-4">
              {trips.map((trip: Trip) => (
                <a
  key={trip.id}
  href={`/trips/${trip.id}`}
  className="
    flex
    items-center
    justify-between
    rounded-3xl
    border
    border-zinc-800
    bg-zinc-900
    p-4
  "
>
  <div>
    <h3 className="font-semibold text-lg">
      {trip.title}
    </h3>

    <p className="text-zinc-500 text-sm">
      {trip.destination}
    </p>

    <div className="flex gap-4 mt-3 text-xs text-zinc-400">
      <span>
        👥 {trip.participants.length}
      </span>

      <span>
        💳 {trip.expenses.length}
      </span>
    </div>
  </div>

  <div
    className="
      w-10
      h-10
      rounded-2xl
      bg-violet-600
      flex
      items-center
      justify-center
    "
  >
    ✈️
  </div>
</a>
              ))}
            </div>
          )}
        </div>
      </div>
{trips.length === 0 && (
  <Link
    href="/trips/new"
    className="
      fixed
      bottom-24
      right-5
      w-14
      h-14
      rounded-full
      bg-violet-600
      text-white
      flex
      items-center
      justify-center
      text-3xl
      shadow-xl
      z-40
    "
  >
    +
  </Link>
)}
      <BottomNavigation />
    </DashboardLayout>
  );
}
