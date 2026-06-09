import { prisma } from "@/lib/prisma";
// import AddMember from "@/components/AddMember";
import DeleteTripButton from "@/components/DeleteTripButton";
// import AddExpense from "@/components/AddExpense";
import Link from "next/link";
import { auth as getAuth } from "@/auth";
// import InviteMember from "@/components/InviteMember";
// import WhatsappInvite from "@/components/WhatsappInvite";
// import {
//   Key,
//   ReactElement,
//   JSXElementConstructor,
//   ReactNode,
//   ReactPortal,
// } from "react";
import { calculateSettlement }
from "@/lib/calculateSettlement";
// import AddParticipant from "@/components/AddParticipant";
import DeleteParticipantButton from "@/components/DeleteParticipantButton";
// import DeleteMemberButton from "@/components/DeleteMemberButton";
import DeleteExpenseButton from "@/components/DeleteExpenseButton";
import EditExpenseModal from "@/components/EditExpenseModal";
import TripTabs from "@/components/trip/TripTabs";
// import AddMemberModal from "@/components/AddMemberModal";
import AddMemberButton from "@/components/AddMemberButton";
import AddExpenseButton from "@/components/AddExpenseButton";
import SettlementSummary from "@/components/trip/SettlementSummary";
import ShareSettlementPDF from "@/components/trip/ShareSettlementPDF";

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
  const result = calculateSettlement(trip) as any;
  const totalExpense = trip.expenses.reduce(
    (sum: number, expense: { amount: number }) => sum + expense.amount,
    0,
  );

  const totalPeople =
  trip.participants.length +
  trip.members.length;



  const memberCount = trip.participants.length;
  const perPerson = memberCount > 0 ? totalExpense / memberCount : 0;

  

  return (
    <div className="max-w-7xl mx-auto p-6 pt-[100px] pb-28">
      {/* Hero */}
      <div
        className="
    bg-gradient-to-br
    from-violet-600
    to-blue-600
    rounded-2xl
    p-4
    text-white
    mb-5
  "
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold leading-tight">
              {trip.title}{" "}
              <span className="text-sm text-white/80">
                ( {trip.destination || "No destination"})
              </span>
            </h1>
          </div>
        </div>

        <div className="flex justify-between mt-2 pt-2 border-t border-white/10">
          <div>
            <div className="text-[10px] text-white/60 uppercase">Expense</div>

            <div className="text-sm font-semibold">
              ₹{totalExpense.toFixed(0)}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-white/60 uppercase">Members</div>

            <div className="text-sm font-semibold">{memberCount}</div>
          </div>

          <div>
            <div className="text-[10px] text-white/60 uppercase">Split</div>

            <div className="text-sm font-semibold">₹{perPerson.toFixed(0)}</div>
          </div>
        </div>
      </div>

      <TripTabs
        people={
          <>
            <div className="bg-zinc-900 border border-zinc-800 rounded-[16px] p-3 mb-3">
              <h2 className="text-[18px] font-bold mb-3">Trip Participants</h2>

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
              flex-wrap
              relative
              rounded-xl
              w-full
              p-2 bg-zinc-800 rounded-2xl p-3 
            "
                    >
                      <div>
                        <div className="font-medium text-[14px]">
                          {participant.user?.name}
                        </div>

                        <div className="text-[12px] text-zinc-500">
                          {participant.user?.email}
                        </div>
                        <div
                          className={`
      py-1 rounded-full text-[12px]
      ${participant.role === "owner" ? "text-zinc-500" : "text-zinc-500"}
    `}
                        >
                          {participant.role === "owner"
                            ? "👑 Owner"
                            : "👤 Member"}
                        </div>
                      </div>

                      <div className="flex items-center absolute right-3 top-3 gap-2">
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

              <AddMemberButton
                tripId={trip.id}
                currentUserId={user.id}
                participants={trip.participants.map(
                  (participant: { userId: any }) => ({
                    userId: participant.userId,
                  }),
                )}
              />
            </div>
          </>
        }
        expenses={
          <>
            <div className="bg-zinc-900 border border-zinc-800 rounded-[16px] p-3 mb-3">
              <h2 className="text-[18px] font-bold mb-3">💰 Expenses</h2>

              {trip.expenses.length === 0 ? (
                <div className="text-zinc-500">No expenses yet</div>
              ) : (
                <div className="space-y-2">
                  {trip.expenses.map((expense: any) => (
                    <div
                      key={expense.id}
                      className="bg-zinc-800 rounded-[8px] p-3 relative"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-[14px]">
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

                        <div className="text-[16px] font-bold text-green-400">
                          ₹{expense.amount}
                        </div>
                      </div>

                      <div className="flex gap absolute bottom-3 right-3">
                        <EditExpenseModal
                          tripId={trip.id}
                          expense={{
                            id: expense.id,
                            title: expense.title,
                            amount: expense.amount,
                          }}
                          members={[
                            ...trip.participants.map(
                              (participant: {
                                id: any;
                                user: { name: any; email: any };
                              }) => ({
                                id: participant.id,
                                name:
                                  participant.user.name ??
                                  participant.user.email,
                                type: "participant" as const,
                              }),
                            ),

                            ...trip.members.map(
                              (member: { id: any; name: any }) => ({
                                id: member.id,
                                name: member.name,
                                type: "member" as const,
                              }),
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
            <AddExpenseButton
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
              ]}
            />
            {/* <div className="bg-zinc-900 border border-zinc-800 rounded-[16px] p-3 mb-4"> */}
              {/* <AddExpense
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
                ]}
              /> */}
            {/* </div> */}
          </>
        }
        settlement={
          <>
           <SettlementSummary
  tripId={trip.id}
  tripTitle={trip.title}
  totalExpense={
    result.totalExpense
  }
  totalPeople={
    result.totalPeople
  }
  perPerson={
    result.perPerson
  }
  settlements={
    result.settlements
  }
/>

<ShareSettlementPDF
  tripId={trip.id}
/>
         
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
          mb-5
          flex
        "
            >
              View Settlement
            </Link>
          </>
        }
      />
      <div className="flex flex-wrap gap-4">
        <DeleteTripButton tripId={trip.id} />
      </div>
    </div>
  );
}
