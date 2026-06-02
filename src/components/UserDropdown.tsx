"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function UserDropdown({
  name,
  email,
  phone,
  image,
}: {
  name: string;
  email: string;
  phone?: string;
  image?: string;
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          w-12
          h-12
          rounded-full
          overflow-hidden
          border
          border-zinc-700
          bg-purple-600
          flex
          items-center
          justify-center
          font-bold
          text-white
        "
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            width={48}
            height={48}
            className="
              w-full
              h-full
              object-cover
            "
          />
        ) : (
          <span>
            {name
              .charAt(0)
              .toUpperCase()}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute
            right-0
            mt-3
            w-80
            bg-white
            text-black
            rounded-3xl
            shadow-2xl
            border
            overflow-hidden
            z-50
          "
        >
          {/* User Info */}
          <div className="p-5 border-b">
            <div className="flex items-center gap-4">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  width={64}
                  height={64}
                  className="
                    w-16
                    h-16
                    rounded-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    w-16
                    h-16
                    rounded-full
                    bg-purple-600
                    text-white
                    flex
                    items-center
                    justify-center
                    text-2xl
                    font-bold
                  "
                >
                  {name
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div>
                <div className="font-bold text-lg">
                  {name}
                </div>

                <div className="text-sm text-gray-500">
                  {email}
                </div>

                {phone && (
                  <div className="text-sm text-gray-500">
                    {phone}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="p-2">
            <Link
              href="/profile"
              className="
                block
                px-4
                py-3
                rounded-xl
                hover:bg-gray-100
                transition
              "
            >
              👤 Profile
            </Link>

            <Link
              href="/trips"
              className="
                block
                px-4
                py-3
                rounded-xl
                hover:bg-gray-100
                transition
              "
            >
              ✈️ My Trips
            </Link>

            <Link
              href="/dashboard"
              className="
                block
                px-4
                py-3
                rounded-xl
                hover:bg-gray-100
                transition
              "
            >
              📊 Dashboard
            </Link>

            <button
              onClick={() =>
                signOut({
                  callbackUrl: "/login",
                })
              }
              className="
                block
                w-full
                text-left
                px-4
                py-3
                rounded-xl
                text-red-600
                hover:bg-red-50
                transition
              "
            >
               👤 Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}