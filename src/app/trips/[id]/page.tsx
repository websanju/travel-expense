import { prisma } from "@/lib/prisma";
import AddMember from "@/components/AddMember";
import DeleteTripButton from "@/components/DeleteTripButton";
import AddExpense from "@/components/AddExpense";
import Link from "next/link";
import { auth as getAuth } from "@/auth";
import InviteMember from "@/components/InviteMember";
import WhatsappInvite from "@/components/WhatsappInvite";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";

import AddParticipant from "@/components/AddParticipant";
import DeleteParticipantButton from "@/components/DeleteParticipantButton";
import DeleteMemberButton from "@/components/DeleteMemberButton";
import DeleteExpenseButton from "@/components/DeleteExpenseButton";
import EditExpenseModal from "@/components/EditExpenseModal";

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold text-red-500">Trip ID Missing</h1>
      </div>
    );
  }

  const session = await getAuth();

  if (!session?.user?.email) {
    return <div>Unauthorized</div>;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }
  const participant = await prisma.tripParticipant.findFirst({
    where: {
      tripId: id,
      userId: user.id,
    },
  });

  if (!participant) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>

        <p className="text-zinc-500 mt-2">You are not a member of this trip.</p>
      </div>
    );
  }

  const trip = await prisma.trip.findUnique({
    where: {
      id,
    },
    include: {
      members: true,
      participants: {
        include: {
          user: true,
        },
      },
      expenses: {
        include: {
          paidByParticipant: {
            include: {
              user: true,
            },
          },
          paidByMember: true,
        },
      },
    },
  });

  if (!trip) {
    return <div className="p-10">Trip not found</div>;
  }

  const totalExpense = trip.expenses.reduce(
    (sum: number, expense: { amount: number }) => sum + expense.amount,
    0,
  );

  const memberCount = trip.participants.length;

  const perPerson = memberCount > 0 ? totalExpense / memberCount : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 pt-[100px] pb-28">
      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-[32px] p-8 text-white mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-bold">{trip.title}</h1>

            <p className="mt-2 text-white/80">
              {trip.destination || "No destination"}
            </p>
          </div>

          <div className="text-6xl">✈️</div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <div className="text-sm text-white/70">Total Expense</div>

            <div className="text-2xl font-bold">₹{totalExpense.toFixed(0)}</div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <div className="text-sm text-white/70">Members</div>

            <div className="text-2xl font-bold">{memberCount}</div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <div className="text-sm text-white/70">Per Person</div>

            <div className="text-2xl font-bold">₹{perPerson.toFixed(0)}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <AddParticipant tripId={id} />
      <div className="grid lg:grid-cols-1 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-6">
          <AddMember tripId={trip.id} />
          <InviteMember tripId={trip.id} />
          <WhatsappInvite tripId={trip.id} />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-6">
          
          <AddExpense
            tripId={trip.id}
            members={[
              ...trip.participants.map(
                (participant: {
                  id: any;
                  user: { name: any; email: any };
                }) => ({
                  id: participant.id,
                  name:
                    participant.user?.name ||
                    participant.user?.email ||
                    "Unknown User",
                  type: "participant" as const,
                }),
              ),

              // ...trip.members.map((member: { id: any; name: any }) => ({
              //   id: member.id,
              //   name: member.name,
              //   type: "member" as const,
              // })),
            ]}
          />
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Trip Participants</h2>

        {trip.participants.length === 0 ? (
          <div>No participants yet</div>
        ) : (
          <div className="space-y-2 ">
            {trip.participants.map((participant: any) => (
              <div
                key={participant.id}
                className="
              flex
              justify-between
              items-center
              rounded-xl
              p-3 bg-zinc-800 rounded-2xl p-5 
            "
              >
                <div>
                  <div className="font-medium">{participant.user?.name}</div>

                  <div className="text-sm text-zinc-500">
                    {participant.user?.email}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`
      px-3 py-1 rounded-full text-sm
      ${
        participant.role === "owner"
          ? "bg-purple-100 text-purple-700"
          : "bg-blue-100 text-blue-700"
      }
    `}
                  >
                    {participant.role === "owner" ? "👑 Owner" : "👤 Member"}
                  </div>

                  {participant.role !== "owner" && (
                    <DeleteParticipantButton
                      tripId={trip.id}
                      participantId={participant.id}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expenses */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 mb-8">
        <h2 className="text-2xl font-bold mb-5">💰 Expenses</h2>

        {trip.expenses.length === 0 ? (
          <div className="text-zinc-500">No expenses yet</div>
        ) : (
          <div className="space-y-4">
          {trip.expenses.map((expense: any) => (
  <div
    key={expense.id}
    className="
      bg-zinc-800
      rounded-2xl
      p-5
    "
  >
    <div className="flex justify-between items-start">
      <div>
        <div className="font-bold text-lg">
          {expense.title}
        </div>

        <div className="text-sm text-zinc-500">
          {expense.category}
        </div>

        <div className="text-xs text-zinc-400 mt-1">
          Paid by{" "}
          {expense.paidByParticipant?.user?.name ||
            expense.paidByParticipant?.user?.email ||
            expense.paidByMember?.name ||
            "Unknown"}
        </div>
      </div>

      <div className="text-2xl font-bold text-green-400">
        ₹{expense.amount}
      </div>
    </div>

    <div className="flex gap-2 mt-4">
      <EditExpenseModal
        tripId={trip.id}
        expense={{
          id: expense.id,
          title: expense.title,
          amount: expense.amount,
        }}
        members={[
          ...trip.participants.map(
            (participant: { id: any; user: { name: any; email: any; }; }) => ({
              id: participant.id,
              name:
                participant.user.name ??
                participant.user.email,
              type:
                "participant" as const,
            })
          ),

          ...trip.members.map(
            (member: { id: any; name: any; }) => ({
              id: member.id,
              name: member.name,
              type:
                "member" as const,
            })
          ),
        ]}
      />

      <DeleteExpenseButton
        tripId={trip.id}
        expenseId={expense.id}
      />
    </div>
  </div>
))}
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Manual Members</h2>

        {trip.members.length === 0 ? (
          <div>No manual members</div>
        ) : (
          <div className="space-y-2">
            {trip.members.map(
              (member: {
                id: any;
                name:
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactPortal
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
                      | Iterable<ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined;
              }) => (
                <div
                  key={member.id}
                  className="
              flex
              justify-between
              items-center
             bg-zinc-800 rounded-2xl p-5
              rounded-xl
              p-3
            "
                >
                  <div>
                    <div className="font-medium">{member.name}</div>

                    <div className="text-sm text-zinc-500">Manual Member</div>
                  </div>

                  <DeleteMemberButton tripId={trip.id} memberId={member.id} />
                </div>
              ),
            )}
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 mb-8">
      <h2 className="text-xl font-bold mb-2">Registered Users</h2>
     <div className="space-y-2">
      {trip.participants.map(
        (participant: {
          id: Key | null | undefined;
          user: {
            name:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<unknown, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactPortal
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | null
                  | undefined
                >
              | null
              | undefined;
            phone:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<unknown, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactPortal
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | null
                  | undefined
                >
              | null
              | undefined;
          };
        }) => (
          <div key={participant.id} className="bg-zinc-800 rounded-2xl p-5 rounded-xl p-3">
            {participant.user.name}
            <div className="text-sm text-zinc-500">
              {participant.user.phone}
            </div>
          </div>
        ),
      )}
      </div>
        </div>
      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Link
          href={`/trips/${trip.id}/settlement`}
          className="
          px-6
          py-3
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-cyan-500
          text-white
          font-semibold
        "
        >
          View Settlement
        </Link>

        <DeleteTripButton tripId={trip.id} />
      </div>
    </div>
  );
}
