"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";


export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
const tripId =
  searchParams.get("trip");
  
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
  useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleRegister(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const res = await fetch(
      "/api/register",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
        }),
      }
    );

    setLoading(false);

    const data = await res.json();

    if (!res.ok) {
      alert(
        data.error ||
          "Registration failed"
      );
      return;
    }

    alert("Registration successful");

if (tripId) {
  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  router.push(`/invite/${tripId}`);
} else {
  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  router.push("/dashboard");
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
        {/* Header */}
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
            Create Account
          </h1>

          <p className="text-zinc-400 mt-2">
            Start managing your travel
            expenses today
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Full Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="John Doe"
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
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
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
    Mobile Number
  </label>

  <input
    type="tel"
    value={phone}
    onChange={(e) =>
      setPhone(e.target.value)
    }
    placeholder="9876543210"
    required
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

          <button
            type="submit"
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
            "
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-zinc-400">
            Already have an account?
          </p>

          <Link
             href={
    tripId
      ? `/login?trip=${tripId}`
      : "/login"
  }
            className="
              inline-block
              mt-3
              text-purple-400
              hover:text-purple-300
              font-medium
            "
          >
            Login Instead →
          </Link>
        </div>
      </div>
    </div>
  );
}