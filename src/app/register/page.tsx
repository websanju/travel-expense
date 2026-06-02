"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

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

    router.push("/login");
  }

  return (
    <div className="max-w-md mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">
        Register
      </h1>

      <form
        onSubmit={handleRegister}
        className="space-y-4"
      >
        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 w-full"
        >
          {loading
            ? "Registering..."
            : "Register"}
        </button>
      </form>
    </div>
  );
}