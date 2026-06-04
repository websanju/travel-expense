import Link from "next/link";
import { auth as getAuth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getAuth();

  const isLoggedIn = !!session?.user;

  const userName =
    session?.user?.name || "User";

  return (
    <div className="max-w-7xl mx-auto px-6 pt-[120px] pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600 p-10 md:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)] opacity-20" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white mb-6">
            ✈️ Smart Travel Expense Manager
          </div>

          <h1 className="text-[42px] md:text-[42px] font-bold text-white leading-tight">
            Split Trip Expenses
            <br />
            Without Headaches
          </h1>

          <p className="text-white/80 text-lg mt-6">
            Track trip expenses, add friends,
            calculate settlements and manage
            travel budgets in one place.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="bg-white text-black px-6 py-3 rounded-2xl font-semibold"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="border border-white text-white px-6 py-3 rounded-2xl font-semibold"
                >
                  Create Account
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="bg-white text-black px-6 py-3 rounded-2xl font-semibold"
                >
                  Open Dashboard
                </Link>

                <div className="bg-white/20 text-white px-6 py-3 rounded-2xl">
                  Welcome {userName} 👋
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-6">
          <div className="text-4xl mb-4">
            👥
          </div>

          <h3 className="text-xl font-bold mb-2">
            Manage Friends
          </h3>

          <p className="text-zinc-400">
            Add trip members and keep track
            of who joined your journey.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-6">
          <div className="text-4xl mb-4">
            💰
          </div>

          <h3 className="text-xl font-bold mb-2">
            Track Expenses
          </h3>

          <p className="text-zinc-400">
            Record hotels, food, transport,
            shopping and every travel cost.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-6">
          <div className="text-4xl mb-4">
            ⚖️
          </div>

          <h3 className="text-xl font-bold mb-2">
            Auto Settlement
          </h3>

          <p className="text-zinc-400">
            Instantly calculate who owes whom
            after the trip ends.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mt-12">
        <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-3xl p-6">
          <div className="text-white/70">
            Trips
          </div>

          <div className="text-4xl font-bold text-white mt-2">
            ∞
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-6">
          <div className="text-white/70">
            Members
          </div>

          <div className="text-4xl font-bold text-white mt-2">
            ∞
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-6">
          <div className="text-white/70">
            Expenses
          </div>

          <div className="text-4xl font-bold text-white mt-2">
            ₹
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl p-6">
          <div className="text-white/70">
            Settlement
          </div>

          <div className="text-4xl font-bold text-white mt-2">
            ⚡
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-14 bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 text-center">
        <h2 className="text-4xl font-bold">
          Ready for your next trip?
        </h2>

        <p className="text-zinc-400 mt-3">
          Create a trip and start tracking
          expenses today.
        </p>

        <div className="mt-6">
          {isLoggedIn ? (
            <Link
              href="/trips/new"
              className="bg-purple-600 px-6 py-3 rounded-2xl inline-block"
            >
              Create Trip
            </Link>
          ) : (
            <Link
              href="/register"
              className="bg-purple-600 px-6 py-3 rounded-2xl inline-block"
            >
              Get Started Free
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}