import Link from "next/link";
import { auth as getAuth } from "@/auth";

export default async function BottomNavigation() {
  const session = await getAuth();

  const isLoggedIn =
    !!session?.user?.email;

  return (
    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
        bg-zinc-900/95
        backdrop-blur-xl
        border-t
        border-zinc-800
        flex
        justify-around
        items-center
        py-4
        z-50
      "
    >
      {isLoggedIn ? (
        <>
          <Link
            href="/dashboard"
            className="flex flex-col items-center text-sm"
          >
            🏠
            <span>Dashboard</span>
          </Link>

          <Link
            href="/trips"
            className="flex flex-col items-center text-sm"
          >
            ✈️
            <span>Trips</span>
          </Link>

          <Link
            href="/profile"
            className="flex flex-col items-center text-sm"
          >
            👤
            <span>Profile</span>
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/"
            className="flex flex-col items-center text-sm"
          >
            🏠
            <span>Home</span>
          </Link>

          <Link
            href="/register"
            className="flex flex-col items-center text-sm"
          >
            ✨
            <span>Register</span>
          </Link>

          <Link
            href="/login"
            className="flex flex-col items-center text-sm"
          >
            🔑
            <span>Login</span>
          </Link>
        </>
      )}
    </div>
  );
}