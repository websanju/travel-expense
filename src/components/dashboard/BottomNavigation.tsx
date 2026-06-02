// src/components/dashboard/BottomNavigation.tsx

import Link from "next/link";

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 flex justify-around p-4">
      <Link href="/dashboard">
        Dashboard
      </Link>

      <Link href="/trips">
        Trips
      </Link>

      {/* <Link href="/public-expenses">
        Expenses
      </Link> */}

      <Link href="/profile">
        Profile
      </Link>
    </div>
  );
}