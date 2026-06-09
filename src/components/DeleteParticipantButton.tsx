"use client";

export default function DeleteParticipantButton({
  tripId,
  participantId,
}: {
  tripId: string;
  participantId: string;
}) {
  async function remove() {
    const ok = window.confirm(
      "Remove participant?"
    );

    if (!ok) {
      return;
    }

    await fetch(
      `/api/trips/${tripId}/participants/${participantId}`,
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
        rounded-full
        w-[20px]
        h-[20px]
        bg-red-600 
        text-white
        text-[10px]
      "
    >
      X
    </button>
  );
}