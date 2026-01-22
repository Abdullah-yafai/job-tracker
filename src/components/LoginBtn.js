"use client";
import { signIn } from "next-auth/react";

export default function LoginBtn() {
  return (
    <button
      onClick={() => signIn("google")}
      className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 shadow-lg transition"
    >
      Continue with Google
    </button>
  );
}