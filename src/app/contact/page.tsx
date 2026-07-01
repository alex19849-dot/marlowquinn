export default function ContactPage() {
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

        <form className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white"
          />

          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white"
          />

          <textarea
            placeholder="Message"
            rows={6}
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white"
          />

          <button
            type="button"
            className="rounded-full bg-[#ff2f8f] px-8 py-3 font-semibold text-black"
          >
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
}
