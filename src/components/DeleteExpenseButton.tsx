"use client";

export default function DeleteExpenseButton({
  tripId,
  expenseId,
}: {
  tripId: string;
  expenseId: string;
}) {
  async function remove() {
    const ok = window.confirm(
      "Delete this expense?"
    );

    if (!ok) {
      return;
    }

    await fetch(
      `/api/trips/${tripId}/expenses/${expenseId}`,
      {
        method: "DELETE",
      }
    );

    window.location.reload();
  }

  return (
    <button
      onClick={remove}
      className="
        bg-red-600
        text-white
        px-3
        py-1
        rounded-lg
        text-sm
      "
    >
      Delete
    </button>
  );
}