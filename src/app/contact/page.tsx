"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sending...");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("https://formspree.io/f/mzdlkarl", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      form.reset();
      setStatus("Message sent. Thank you.");
    } else {
      setStatus("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <section className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#ff2f8f]">
          Contact
        </p>

        <h1 className="text-4xl font-bold sm:text-6xl">Contact</h1>

        <p className="mt-6 text-zinc-300">
          For reader messages, review enquiries, or book-related contact, use
          the form below.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="text"
            name="name"
            required
            placeholder="Name"
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#ff2f8f]"
          />

          <input
            type="email"
            name="email"
            required
            placeholder="Email address"
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#ff2f8f]"
          />

          <textarea
            name="message"
            required
            placeholder="Message"
            rows={6}
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#ff2f8f]"
          />

          <button
            type="submit"
            className="rounded-full bg-[#ff2f8f] px-8 py-3 font-semibold text-black"
          >
            Send Message
          </button>
        </form>

        {status && <p className="mt-6 text-zinc-300">{status}</p>}
      </section>
    </main>
  );
}
