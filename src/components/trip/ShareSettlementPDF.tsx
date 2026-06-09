"use client";

export default function ShareSettlementPDF({
  tripId,
}: {
  tripId: string;
}) {
  async function sharePDF() {
    try {
      const response = await fetch(
        `/api/trips/${tripId}/pdf`
      );

      const blob =
        await response.blob();

      const file = new File(
        [blob],
        "settlement.pdf",
        {
          type:
            "application/pdf",
        }
      );

      if (
        navigator.canShare &&
        navigator.canShare({
          files: [file],
        })
      ) {
        await navigator.share({
          title:
            "Settlement Report",
          text:
            "Trip Settlement Report",
          files: [file],
        });

        return;
      }

      alert(
        "PDF sharing not supported on this device"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to share PDF"
      );
    }
  }

  return (
    <button
      onClick={sharePDF}
      className="
        w-full
        py-4
        rounded-2xl
        bg-green-600
        text-white
        font-semibold
      "
    >
      📄 Share PDF
    </button>
  );
}