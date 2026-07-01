export default function NewsletterPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <section className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#ff2f8f]">
          Reader List
        </p>

        <h1 className="text-4xl font-bold sm:text-6xl">Newsletter</h1>

        <p className="mt-6 text-zinc-300">
          Join Marlow Quinn’s reader list for new release updates, book news,
          and exclusive extras.
        </p>

        <form className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white"
          />

          <button
            type="button"
            className="rounded-full bg-[#ff2f8f] px-8 py-3 font-semibold text-black"
          >
            Join Newsletter
          </button>
        </form>
      </section>
    </main>
  );
}
