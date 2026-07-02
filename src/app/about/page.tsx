import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-12 text-white">
      <section className="mx-auto max-w-5xl text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-[#ff2f8f]">
          About
        </p>

        <h1 className="mt-4 text-4xl font-bold sm:text-6xl">
          Marlow Quinn
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
          Marlow Quinn writes emotionally charged MM romance where the
          chemistry is undeniable, the stakes are high, and love never comes
          easy.
        </p>
      </section>

      <section className="mx-auto mt-14 max-w-4xl space-y-6 text-base leading-8 text-zinc-300">
        <p>
          From possessive werewolves and ancient vampires to hockey stars,
          college athletes, bikers, and FBI agents, every story combines
          unforgettable characters with slow-burning tension, emotional depth,
          and plenty of heat.
        </p>

        <p>
          Expect protective heroes, found family, forbidden attraction,
          hurt/comfort, sharp banter, messy feelings, and relationships that
          force people to question everything they thought they knew about
          themselves.
        </p>

        <p>
          All books are available on Kindle Unlimited.
        </p>
      </section>

      <section className="mx-auto mt-14 max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          What You’ll Find In Marlow Quinn Books
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Emotional MM romance",
            "High heat",
            "Found family",
            "Possessive heroes",
            "Forbidden attraction",
            "Hurt / comfort",
            "Sports romance",
            "Paranormal romance",
            "Happily-ever-afters",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-zinc-800 bg-black/50 px-5 py-4 text-center text-zinc-300"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-4xl text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Start with the books
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
          Browse Marlow Quinn’s full catalogue of dark, emotional, high-heat MM
          romance.
        </p>

        <Link
          href="/books"
          className="mt-8 inline-block rounded-full bg-[#ff2f8f] px-8 py-3 font-semibold text-black"
        >
          Browse Books
        </Link>
      </section>
    </main>
  );
}
