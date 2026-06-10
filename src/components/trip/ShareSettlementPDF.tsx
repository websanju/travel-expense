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

      if (!response.ok) {
        throw new Error(
          "Failed to generate PDF"
        );
      }

      const blob =
        await response.blob();

      console.log(
        "PDF SIZE:",
        blob.size
      );

      if (blob.size === 0) {
        alert(
          "Generated PDF is empty"
        );
        return;
      }

      const file = new File(
        [blob],
        "settlement.pdf",
        {
          type:
            "application/pdf",
        }
      );

      // Mobile Share
      if (
        navigator.canShare &&
        navigator.canShare({
          files: [file],
        })
      ) {
        await navigator.share({
          title:
            "Trip Settlement Report",
          text:
            "Travel Expense Settlement",
          files: [file],
        });

        return;
      }

      // Desktop fallback
      const url =
        URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;
      a.download =
        "settlement.pdf";

      document.body.appendChild(
        a
      );

      a.click();

      a.remove();

      URL.revokeObjectURL(
        url
      );
    } catch (error) {
      console.error(
        "PDF Share Error:",
        error
      );

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
        hover:bg-green-700
        transition
      "
    >
      📄 Share PDF
    </button>
  );
}