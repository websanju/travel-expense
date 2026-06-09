"use client";

export default function DeleteTripButton({
  tripId,
}: {
  tripId: string;
}) {
  async function handleDelete() {
    const confirmed = confirm(
      "Delete this trip?"
    );

    if (!confirmed) return;

    const res = await fetch(
      `/api/trips/${tripId}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(
        data.error || "Delete failed"
      );
      return;
    }

    alert("Trip deleted");

    window.location.href =
      "/trips";
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-4 py-2 w-full rounded rounded-2xl"
    >
      Delete Trip
    </button>
  );
}