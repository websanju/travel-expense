import Link from "next/link";
import ShareSettlementButton from "./ShareSettlementButton";

type Settlement = {
  from: string;
  to: string;
  amount: string;
};

export default function SettlementSummary({
  tripId,
  tripTitle,
  totalExpense,
  totalPeople,
  perPerson,
  settlements,
}: {
  tripId: string;
  tripTitle: string;
  totalExpense: number;
  totalPeople: number;
  perPerson: number;
  settlements: Settlement[];
})

{
    
  return (
    <div className="space-y-3">

      {/* Summary */}
      <div className="bg-zinc-900 rounded-[16px] p-3 border border-zinc-800">
        <h2 className="text-[16px] font-bold mb-3">
          Settlement Summary
        </h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">
              Trip
            </span>

            <span>{tripTitle}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">
              Total Expense
            </span>

            <span>
              ₹{totalExpense.toFixed(0)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">
              People
            </span>

            <span>{totalPeople}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">
              Per Person
            </span>

            <span>
              ₹{perPerson.toFixed(0)}
            </span>
          </div>
        </div>
      </div>

      {/* Settlements */}
      <div className="bg-zinc-900 rounded-[16px] p-3 border border-zinc-800">
        <h2 className="text-[16px] font-bold mb-3">
          Who Pays Whom
        </h2>

        {settlements.length === 0 ? (
          <div className="text-zinc-500">
            Everyone is settled 🎉
          </div>
        ) : (
          <div className="space-y-3">
            {settlements.map(
              (settlement, index) => (
                <div
                  key={index}
                  className="
                    bg-zinc-800
                    rounded-[8px]
                    p-3
                  "
                >
                  <span className="text-[14px]">
                    {settlement.from}
                  </span>

                  {" pays "}

                  <span className="text-[14px] text-zinc-500 mr-2">
                    {settlement.to}
                  </span>

                  {" ₹"}

                  <span className="text-green-400 font-bold">
                    {settlement.amount}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3 mb-3">

        <ShareSettlementButton
          tripTitle={tripTitle}
          settlements={settlements}
          totalExpense={totalExpense}
          totalPeople={totalPeople}
          perPerson={perPerson}
        />

        {/* <Link
          href={`/trips/${tripId}/settlement`}
          className="
            block
            text-center
            py-4
            rounded-2xl
            bg-blue-600
            text-white
            font-semibold
          "
        >
          Full Settlement Page
        </Link> */}
      </div>
    </div>
  );
}