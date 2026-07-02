"use client";

import { useState } from "react";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        setEmail("");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <section className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#ff2f8f]">
          Reader List
        </p>

        <h1 className="text-4xl font-bold sm:text-6xl">
          Newsletter
        </h1>

        <p className="mt-6 text-zinc-300">
          Join Marlow Quinn's reader list for new release updates, exclusive
          bonus content, cover reveals, and subscriber-only extras.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#ff2f8f]"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#ff2f8f] px-8 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Joining..." : "Join Newsletter"}
          </button>
        </form>

        {message && (
          <p className="mt-6 text-zinc-300">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
