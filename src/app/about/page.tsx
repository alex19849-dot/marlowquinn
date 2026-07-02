import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="border-l-2 border-[#ff2f8f] pl-6">
            <p className="text-xs uppercase tracking-[0.45em] text-[#ff2f8f]">
              About
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-6xl">
              Marlow Quinn
            </h1>

            <p className="mt-5 max-w-sm text-sm uppercase tracking-[0.3em] text-zinc-500">
              Dark. Emotional. High-heat MM romance.
            </p>
          </div>

          <div className="space-y-6 text-base leading-8 text-zinc-300">
            <p>
              Marlow Quinn writes intense MM romance built around chemistry,
              tension, loyalty, complicated desire, and happily-ever-afters that
              do not come easily.
            </p>

            <p>
              The stories move through sports romance, romantic suspense,
              contemporary romance, paranormal romance, and darker emotional
              love stories, but the heart of every book is the same: two men
              pushed to the edge of what they thought they wanted, then forced
              to decide what they are willing to risk for love.
            </p>

            <p>
              Expect possessive heroes, sharp banter, found family, forbidden
              attraction, emotional conflict, high heat, and relationships that
              leave a mark.
            </p>

            <p className="font-semibold text-white">
              All Marlow Quinn books are available on Kindle Unlimited.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-zinc-800 pt-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#ff2f8f]">
                Romance
              </p>
              <p className="mt-3 text-zinc-400">
                Emotional, messy, high-stakes relationships with heat and heart.
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#ff2f8f]">
                Tension
              </p>
              <p className="mt-3 text-zinc-400">
                Forbidden attraction, rivalry, danger, secrets, and slow-burning
                obsession.
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#ff2f8f]">
                HEA
              </p>
              <p className="mt-3 text-zinc-400">
                Every story leads to a hard-won happily-ever-after.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/books"
            className="rounded-full bg-[#ff2f8f] px-8 py-3 font-semibold text-black"
          >
            Browse Books
          </Link>
        </div>
      </section>
    </main>
  );
}
