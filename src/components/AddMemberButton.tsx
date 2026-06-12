"use client";

import { useState } from "react";
import AddMemberModal from "./AddMemberModal";

export default function AddMemberButton(props: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className=" w-full mt-3 py-2 rounded-[8px] text-[14px] text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.01] transition disabled:opacity-50 disabled:cursor-not-allowed "
        onClick={() => setOpen(true)}
      >
        + Add Member
      </button>

      <AddMemberModal open={open} onClose={() => setOpen(false)} {...props} />
    </>
  );
}
