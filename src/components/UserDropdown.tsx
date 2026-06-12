"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function UserDropdown({
  isLoggedIn,
  name,
  email,
  phone,
  image,
}: {
  isLoggedIn: boolean;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
}) {
  const [open, setOpen] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const displayName =
    name || "Guest";

  const closeMenu = () => {
    setOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {/* Avatar */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          w-8
          h-8
          rounded-full
          overflow-hidden
          border
          border-zinc-700
          bg-gradient-to-br
          from-purple-600
          to-blue-600
          flex
          items-center
          justify-center
          text-white
          font-bold
          shadow-lg
        "
      >
        {image ? (
          <Image
            src={image}
            alt={displayName}
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
            {displayName
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
                  alt={displayName}
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
                    bg-gradient-to-br
                    from-purple-600
                    to-blue-600
                    text-white
                    flex
                    items-center
                    justify-center
                    text-2xl
                    font-bold
                  "
                >
                  {displayName
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div>
                <div className="font-bold text-lg">
                  {isLoggedIn
                    ? displayName
                    : "Guest User"}
                </div>

                <div className="text-sm text-gray-500">
                  {isLoggedIn
                    ? email
                    : "Please Login"}
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
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  onClick={closeMenu}
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
                  href="/dashboard"
                  onClick={closeMenu}
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

                <Link
                  href="/trips"
                  onClick={closeMenu}
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

                <button
                  onClick={() => {
                    setOpen(false);

                    signOut({
                      callbackUrl:
                        "/",
                    });
                  }}
                  className="
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
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="
                    block
                    px-4
                    py-3
                    rounded-xl
                    hover:bg-gray-100
                    transition
                  "
                >
                  🔑 Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="
                    block
                    px-4
                    py-3
                    rounded-xl
                    hover:bg-gray-100
                    transition
                  "
                >
                  ✨ Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}