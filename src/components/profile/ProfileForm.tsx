"use client";

import { useState } from "react";
import Image from "next/image";
export default function ProfileForm({
  initialName,
  initialPhone,
  initialImage,
  email,
  joinedDate,
}: {
  initialName: string;
  initialPhone: string;
  initialImage: string;
  email: string;
  joinedDate: Date;
}) {
  const [editing, setEditing] = useState(false);
  const [image, setImage] = useState(initialImage || "");
  const [name, setName] = useState(initialName);

  const [phone, setPhone] = useState(initialPhone);

  const [loading, setLoading] = useState(false);

  async function saveProfile() {
    try {
      setLoading(true);

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          image,
        }),
      });

      if (!res.ok) {
        alert("Failed to update profile");
        return;
      }

      alert("Profile updated successfully");

      setEditing(false);

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 mt-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Profile Information</h2>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-xl text-white"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="bg-zinc-700 px-4 py-2 rounded-xl"
            >
              Cancel
            </button>

            <button
              onClick={saveProfile}
              disabled={loading}
              className="bg-green-600 px-4 py-2 rounded-xl text-white"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="text-zinc-500 text-sm block mb-2">Full Name</label>

          {editing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full
                bg-zinc-800
                border
                border-zinc-700
                rounded-xl
                p-3
              "
            />
          ) : (
            <div className="text-lg font-medium">{name || "-"}</div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-zinc-500 text-sm block mb-2">
            Email Address
          </label>

          <div className="text-lg font-medium">{email}</div>
        </div>

        {/* Phone */}
        <div>
          <label className="text-zinc-500 text-sm block mb-2">
            Phone Number
          </label>

          {editing ? (
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="
                w-full
                bg-zinc-800
                border
                border-zinc-700
                rounded-xl
                p-3
              "
              placeholder="+91 9876543210"
            />
          ) : (
            <div className="text-lg font-medium">{phone || "Not Added"}</div>
          )}
        </div>

        <div>
          <label className="text-zinc-500 text-sm block mb-2">
            Profile Image
          </label>

          {editing ? (
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/profile.jpg"
              className="
        w-full
        bg-zinc-800
        border
        border-zinc-700
        rounded-xl
        p-3
      "
            />
          ) : (
            <div className="space-y-3">
              {/* <div className="text-zinc-400 break-all">
        {image || "No image added"}
      </div> */}

              {image && (
  <Image
    src={image}
    alt="Profile"
    width={96}
    height={96}
    className="
      w-24
      h-24
      rounded-full
      object-cover
      border
      border-zinc-700
    "
  />
)}
            </div>
          )}
        </div>
        {/* Joined */}
        <div>
          <label className="text-zinc-500 text-sm block mb-2">
            Member Since
          </label>

          <div className="text-lg font-medium">
            {new Date(joinedDate).toISOString().split("T")[0]}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-zinc-500 text-sm block mb-2">
            Account Status
          </label>

          <div className="text-green-500 font-semibold">Active</div>
        </div>
      </div>
    </div>
  );
}
