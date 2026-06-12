import { auth as getAuth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProfileForm from "@/components/profile/ProfileForm";
import Image from "next/image";
import { Expense, Trip } from "@prisma/client";
export default async function ProfilePage() {
  const session = await getAuth();

  if (!session?.user?.email) {
    return (
      <div className="max-w-7xl mx-auto p-6 pt-[100px]">
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
      <div className="max-w-7xl mx-auto p-6 pt-[100px]">
        User not found
      </div>
    );
  }




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
   const totalTrips = trips.length;
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

  return (
    <div className="max-w-7xl mx-auto p-3 pt-[70px] pb-28">

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-[16px] p-3 text-white">
        <div className="flex items-center gap-6">
          {user.image ? (
  <Image
    src={user.image}
    alt={user.name || "Profile"}
    width={56}
    height={56}
    className="
      w-16
      h-16
      rounded-full
      object-cover
      border-4
      border-white/20
    "
  />
) : (
  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
    {user.name?.charAt(0).toUpperCase() || "U"}
  </div>
)}

          <div>
            <h1 className="text-[26px] font-bold">
              {user.name || "User"}
            </h1>

            <p className="text-white/80 text-[20px]">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* User Information */}
      <ProfileForm
  initialName={user.name || ""}
  initialPhone={user.phone || ""}
   initialImage={user.image || ""}
  email={user.email}
  joinedDate={user.createdAt}
/>
      

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-3 mt-3">

        <div className="bg-zinc-900 border border-zinc-800 rounded-[16px] p-3">
          <div className="text-zinc-500 text-sm">
            Total Trips
          </div>

          <div className="text-[16px] font-bold mt-1">
            {totalTrips}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[16px] p-3">
          <div className="text-zinc-500 text-sm">
            Total Expenses
          </div>

          <div className="text-[16px] font-bold mt-1">
            ₹
            {Number(
              totalExpenseAmount
            ).toFixed(2)}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[16px] p-3">
          <div className="text-zinc-500 text-sm">
            Account Status
          </div>

          <div className="text-[16px] font-bold text-green-500 mt-1">
            Active
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-3 bg-zinc-900 border border-zinc-800 rounded-[16px] p-3">
        <h2 className="text-[16px] mb-3">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/trips"
            className="bg-blue-600 px-3 py-1 rounded-[8px] text-[14px] text-white"
          >
            My Trips
          </Link>

          <Link
            href="/dashboard"
            className="bg-violet-600 px-3 py-1 rounded-[8px]   text-[14px] text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/profile/edit"
            className="bg-green-600 px-3 py-1 rounded-[8px]  text-[14px]  text-white"
          >
            Edit Profile
          </Link>
        </div>
      </div>

    </div>
  );
}