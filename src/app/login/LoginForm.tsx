"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams =
    useSearchParams();

  const tripId =
    searchParams.get("trip");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function navigateTo(
    url: string
  ) {
    window.location.href = url;
  }

  async function handleLogin() {
    setLoading(true);
    setError(null);

    const res = await signIn(
      "credentials",
      {
        redirect: false,
        email,
        password,
      }
    );

    setLoading(false);

    if (!res) {
      setError("Unknown error");
      return;
    }

    if (res.error) {
      setError(res.error);
      return;
    }

    if (tripId) {
      navigateTo(
        `/invite/${tripId}`
      );
    } else {
      navigateTo(
        "/dashboard"
      );
    }
  }

  return (
    <div className="flex items-center justify-center px-6 pt-[200px] pb-10">
      <div
        className="
          w-full
          max-w-md
          bg-zinc-900
          border
          border-zinc-800
          rounded-[32px]
          p-8
          shadow-2xl
        "
      >
        <div className="text-center mb-8">
          <div
            className="
              w-20
              h-20
              mx-auto
              rounded-3xl
              bg-gradient-to-br
              from-purple-600
              to-blue-600
              flex
              items-center
              justify-center
              text-4xl
              mb-5
            "
          >
            ✈️
          </div>

          <h1 className="text-4xl font-bold">
            Welcome Back
          </h1>

          <p className="text-zinc-400 mt-2">
            Sign in to manage your
            travel expenses
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="john@example.com"
              className="
                w-full
                bg-zinc-800
                border
                border-zinc-700
                rounded-2xl
                px-4
                py-3
                outline-none
                focus:border-purple-500
              "
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="••••••••"
              className="
                w-full
                bg-zinc-800
                border
                border-zinc-700
                rounded-2xl
                px-4
                py-3
                outline-none
                focus:border-purple-500
              "
            />
          </div>

          {error && (
            <div
              className="
                bg-red-500/10
                border
                border-red-500/20
                text-red-400
                rounded-xl
                p-3
                text-sm
              "
            >
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="
              w-full
              py-3
              rounded-2xl
              bg-gradient-to-r
              from-purple-600
              to-blue-600
              text-white
              font-semibold
              shadow-lg
              hover:scale-[1.02]
              transition
              disabled:opacity-50
            "
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-zinc-400">
            Don't have an account?
          </p>

          <Link
            href={
              tripId
                ? `/register?trip=${tripId}`
                : "/register"
            }
            className="
              inline-block
              mt-3
              text-purple-400
              hover:text-purple-300
              font-medium
            "
          >
            Create Account →
          </Link>
        </div>
      </div>
    </div>
  );
}