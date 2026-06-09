"use client";

import WhatsappInvite from "./WhatsappInvite";
import InviteMember from "./InviteMember";
import AddParticipant from "./AddParticipant";

export default function AddMemberModal({
  open,
  onClose,
  tripId,
  currentUserId,
  participants,
}: {
  open: boolean;
  onClose: () => void;
  tripId: string;
  currentUserId: string;
  participants: { userId: string }[];
}) {
  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/70
        flex
        items-center
        justify-center
        z-[1111111]
      "
    >
      <div
        className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-6
          w-full
          max-w-lg
          mx-4
          max-h-[90vh]
          overflow-y-auto
        "
      >
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">
            Add Member
          </h2>

          <button
            onClick={onClose}
            className="text-zinc-400"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">
              Existing User
            </h3>

            <AddParticipant
              tripId={tripId}
              currentUserId={currentUserId}
              participants={participants}
            />
          </div>

          <div>
            <h3 className="font-semibold mb-3">
              WhatsApp Invite
            </h3>

            <WhatsappInvite
              tripId={tripId}
            />
          </div>

          <div>
            <h3 className="font-semibold mb-3">
              Email Invite
            </h3>

            <InviteMember
              tripId={tripId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}