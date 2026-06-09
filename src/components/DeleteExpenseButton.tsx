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
        text-white
        px-1
          py-1
          rounded-lg
          text-[10px]
      "
    >

      <svg width="16px" height="16px" viewBox="0 0 16.000001 16.000001" xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg2" fill="#ff0000" stroke="#ff0000">


<g transform="matrix(.7 0 0 .7 .6 -6.7)"  id="layer4">

<path id="rect833" transform="translate(-.857 9.571) scale(1.42857)" d="M3 6v8c0 .554.446 1 1 1h8c.554 0 1-.446 1-1V6z"/>

<path id="rect840" transform="translate(-.857 9.571) scale(1.42857)" d="M5 1v2H2v2h12V3h-3V1zm1 1h4v1H6z" />

</g>

</svg>
    </button>
  );
}