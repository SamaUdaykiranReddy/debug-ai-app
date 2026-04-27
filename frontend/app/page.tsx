"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-5xl font-extrabold text-indigo-500">🐛 AI Debug Platform</h1>
      <p className="text-gray-400 text-lg max-w-md">
        Paste your buggy code and error messages. Let AI identify the root cause,
        explain it, and apply the fix instantly.
      </p>
      <div className="flex gap-4 mt-2">
        <button
          onClick={() => router.push("/login")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/register")}
          className="bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white font-semibold px-8 py-3 rounded-xl transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}