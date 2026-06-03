"use client";

export default function DeleteMemberButton({
  tripId,
  memberId,
}: {
  tripId: string;
  memberId: string;
}) {
  async function remove() {
    const ok = window.confirm(
      "Remove member?"
    );

    if (!ok) {
      return;
    }

    await fetch(
      `/api/trips/${tripId}/members/${memberId}`,
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
        px-3
        py-1
        rounded-lg
        bg-red-600
        text-white
        text-sm
      "
    >
      Remove
    </button>
  );
}