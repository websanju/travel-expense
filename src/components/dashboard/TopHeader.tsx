import { auth as getAuth } from "@/auth";
import { prisma } from "@/lib/prisma";
import UserDropdown from "@/components/UserDropdown";
import Link from "next/link";

export default async function TopHeader() {
  const session = await getAuth();

  const email =
    session?.user?.email || "";

  const user = email
    ? await prisma.user.findUnique({
        where: {
          email,
        },
      })
    : null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              T
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">
                Travel Expense
              </h1>

              <p className="text-xs text-zinc-400">
                Track • Split • Settle
              </p>
            </div>
          </Link>

          {/* User */}
         <UserDropdown
  isLoggedIn={!!session?.user}
  name={user?.name || ""}
  email={user?.email || ""}
  phone={user?.phone || ""}
  image={user?.image || ""}
/>
        </div>
      </div>
    </header>
  );
}