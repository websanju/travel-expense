"use client";

import { useState } from "react";
import AddMemberModal from "./AddMemberModal";

export default function AddMemberButton(props: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className=" w-full mt-5 py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.01] transition disabled:opacity-50 disabled:cursor-not-allowed "
        onClick={() => setOpen(true)}
      >
        + Add Member
      </button>

      <AddMemberModal open={open} onClose={() => setOpen(false)} {...props} />
    </>
  );
}
