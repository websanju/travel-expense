import { auth as getAuth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProfileForm from "@/components/profile/ProfileForm";
import Image from "next/image";
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

  const totalTrips =
    await prisma.trip.count({
      where: {
        userId: user.id,
      },
    });

  const totalExpenses =
    await prisma.expense.aggregate({
      where: {
        userId: user.id,
      },
      _sum: {
        amount: true,
      },
    });

  const totalExpenseAmount =
    totalExpenses._sum.amount || 0;

  return (
    <div className="max-w-7xl mx-auto p-6 pt-[100px] pb-28">

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-[32px] p-8 text-white">
        <div className="flex items-center gap-6">
          {user.image ? (
  <Image
    src={user.image}
    alt={user.name || "Profile"}
    width={96}
    height={96}
    className="
      w-24
      h-24
      rounded-full
      object-cover
      border-4
      border-white/20
    "
  />
) : (
  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
    {user.name?.charAt(0).toUpperCase() || "U"}
  </div>
)}

          <div>
            <h1 className="text-4xl font-bold">
              {user.name || "User"}
            </h1>

            <p className="text-white/80 mt-1">
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
      <div className="grid md:grid-cols-3 gap-6 mt-8">

        <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-6">
          <div className="text-zinc-500 text-sm">
            Total Trips
          </div>

          <div className="text-4xl font-bold mt-3">
            {totalTrips}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-6">
          <div className="text-zinc-500 text-sm">
            Total Expenses
          </div>

          <div className="text-4xl font-bold mt-3">
            ₹
            {Number(
              totalExpenseAmount
            ).toFixed(2)}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-6">
          <div className="text-zinc-500 text-sm">
            Account Status
          </div>

          <div className="text-xl font-bold text-green-500 mt-4">
            Active
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-[32px] p-8">
        <h2 className="text-2xl font-bold mb-5">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/trips"
            className="bg-blue-600 px-5 py-3 rounded-xl text-white"
          >
            My Trips
          </Link>

          <Link
            href="/dashboard"
            className="bg-violet-600 px-5 py-3 rounded-xl text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/profile/edit"
            className="bg-green-600 px-5 py-3 rounded-xl text-white"
          >
            Edit Profile
          </Link>
        </div>
      </div>

    </div>
  );
}