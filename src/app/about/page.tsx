import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-[#ff2f8f]">
          About the Author
        </p>

        <h1 className="mt-4 text-4xl font-bold uppercase tracking-[0.12em] sm:text-6xl">
          Marlow Quinn
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          Marlow Quinn writes dark, emotional MM romance with sharp chemistry,
          messy feelings, high heat, and happily-ever-afters that have to be
          fought for.
        </p>
      </section>

      <section className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {[
          "Forbidden attraction",
          "Protective heroes",
          "Found family",
          "Sports romance",
          "Romantic suspense",
          "High heat",
        ].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200">
              {item}
            </p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-14 max-w-3xl space-y-6 text-center text-base leading-8 text-zinc-300">
        <p>
          Across every story, Marlow Quinn focuses on intense connection,
          complicated desire, emotional tension, and characters who do not get
          the easy version of love.
        </p>

        <p>
          Expect brooding heroes, reckless choices, banter, angst, loyalty,
          possessiveness, vulnerability, and romance that pushes characters past
          the versions of themselves they thought they had to be.
        </p>

        <p className="font-semibold text-white">
          All books are available on Kindle Unlimited.
        </p>
      </section>

      <section className="mx-auto mt-14 max-w-4xl rounded-3xl border border-[#ff2f8f]/40 bg-[#ff2f8f]/10 p-8 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Start with the full catalogue
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-zinc-300">
          Browse dark, emotional, high-heat MM romance from Marlow Quinn.
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
