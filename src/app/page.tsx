import Link from "next/link";
import { auth as getAuth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getAuth();

  const isLoggedIn = !!session?.user;

  const userName =
    session?.user?.name || "User";

  return (
    <div className="max-w-7xl mx-auto px-3 pt-[100px] pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600 p-4 md:p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)] opacity-20" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-2 text-[12px] text-white mb-3">
            ✈️ Smart Travel Expense Manager
          </div>

          <h1 className="text-[22px] md:text-[22px] font-bold text-white leading-tight">
            Split Trip Expenses Without Headaches
          </h1>

          <p className="text-white/80 text-[14px] mt-3">
            Track trip expenses, add friends,
            calculate settlements and manage
            travel budgets in one place.
          </p>

          <div className="flex flex-wrap gap-4 mt-3">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="bg-white text-black px-3 py-1 rounded-[8px] font-semibold text-[14px]"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="border border-white text-white px-3 py-1 rounded-[8px] text-[14px] font-semibold"
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
      <div className="grid md:grid-cols-3 gap-3 mt-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-[16px] p-3">
          <div className="text-4xl mb-1">
            👥
          </div>

          <h3 className="text-[16px] font-bold mb-1">
            Manage Friends
          </h3>

          <p className="text-zinc-400 text-[13px]">
            Add trip members and keep track
            of who joined your journey.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[16px] p-3">
          <div className="text-4xl mb-1">
            💰
          </div>

          <h3 className="text-[16px] font-bold mb-1">
            Track Expenses
          </h3>

          <p className="text-zinc-400 text-[13px]">
            Record hotels, food, transport,
            shopping and every travel cost.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[16px] p-3">
          <div className="text-4xl mb-1">
            ⚖️
          </div>

          <h3 className="text-[16px] font-bold mb-1">
            Auto Settlement
          </h3>

          <p className="text-zinc-400 text-[13px]">
            Instantly calculate who owes whom
            after the trip ends.
          </p>
        </div>
      </div>

    

      {/* CTA */}
      <div className="mt-3 bg-zinc-900 border border-zinc-800 rounded-[16px] pt-4 pb-4 p-3 text-center">
        <h2 className="text-[22px] font-bold">
          Ready for your next trip?
        </h2>

        <p className="text-zinc-400 text-[12px] mt-1">
          Create a trip and start tracking
          expenses today.
        </p>

        <div className="mt-3">
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
              className="bg-purple-600 px-3 py-1 text-[14px] rounded-[8px] inline-block"
            >
              Get Started Free
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}