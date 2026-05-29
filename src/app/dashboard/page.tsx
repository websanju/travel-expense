import { auth as getAuth } from "@/auth";
import dynamic from "next/dynamic";

const ExpenseManager = dynamic(() => import("@/components/ExpenseManager"), { ssr: false });

export default async function Dashboard() {
  const session = await getAuth();

  if (!session) {
    return <div className="p-10">Please login</div>;
  }

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">Welcome {session.user?.name}</h1>

      <ExpenseManager />
    </div>
  );
}