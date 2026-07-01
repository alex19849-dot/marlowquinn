import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <section className="mx-auto flex max-w-5xl flex-col items-center justify-center text-center">
        <p className="mb-6 text-sm uppercase tracking-[0.35em] text-[#ff2f8f]">
          MM Romance Author
        </p>

        <Image
          src="/marlow-logo.png"
          alt="Marlow Quinn Author Logo"
          width={900}
          height={450}
          priority
          className="w-full max-w-3xl"
        />

        <p className="mt-8 max-w-2xl text-xl text-zinc-300">
          Emotional MM Romance with bite, heat, and heart.
        </p>

        <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-400">
          Marlow Quinn writes intense MM romance packed with chemistry, tension,
          found family, forbidden attraction, possessive heroes, and
          happily-ever-afters that have to be fought for.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/books"
            className="rounded-full bg-[#ff2f8f] px-8 py-3 font-semibold text-black"
          >
            Browse Books
          </a>

          <a
            href="/newsletter"
            className="rounded-full border border-zinc-700 px-8 py-3 font-semibold text-white"
          >
            Join Newsletter
          </a>
        </div>
      </section>
    </main>
  );
}
