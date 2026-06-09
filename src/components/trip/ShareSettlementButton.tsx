"use client";

type Settlement = {
  from: string;
  to: string;
  amount: string;
};

export default function ShareSettlementButton({
  tripTitle,
  settlements,
  totalExpense,
  totalPeople,
  perPerson,
}: {
  tripTitle: string;
  settlements: Settlement[];
  totalExpense: number;
  totalPeople: number;
  perPerson: number;
}) {
  function share() {
    let text =
      `✈️ ${tripTitle}\n\n`;

    text +=
      `💰 Total Expense: ₹${totalExpense.toFixed(
        0
      )}\n`;

    text +=
      `👥 People: ${totalPeople}\n`;

    text +=
      `💵 Per Person: ₹${perPerson.toFixed(
        0
      )}\n\n`;

    if (
      settlements.length === 0
    ) {
      text +=
        "✅ Everyone is settled";
    } else {
      text +=
        "Settlement:\n\n";

      settlements.forEach(
        (s) => {
          text +=
            `• ${s.from} pays ${s.to} ₹${s.amount}\n`;
        }
      );
    }

    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        text
      )}`,
      "_blank"
    );
  }

  return (
    <button
      onClick={share}
      className="
        w-full
        py-4
        rounded-2xl
        bg-green-600
        text-white
        font-semibold
      "
    >
      💬 Share on WhatsApp
    </button>
  );
}