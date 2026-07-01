import Image from "next/image";
import Link from "next/link";
import { books } from "@/data/books";

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#050505] text-white">
      <section className="relative flex items-center justify-center px-6 pb-8 pt-8 text-center sm:pb-10 sm:pt-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,47,143,0.18),transparent_38%)]" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <Image
            src="/marlow-logo.png"
            alt="Marlow Quinn Author Logo"
            width={900}
            height={450}
            priority
            className="mx-auto w-full max-w-xl sm:max-w-2xl lg:max-w-[680px]"
          />

          <p className="mt-3 text-lg text-zinc-200 sm:text-xl">
            Emotional MM Romance with bite, heat, and heart.
          </p>

          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/books"
              className="rounded-full bg-[#ff2f8f] px-7 py-3 font-semibold text-black"
            >
              Browse Books
            </Link>

            <Link
              href="/newsletter"
              className="rounded-full border border-zinc-700 px-7 py-3 font-semibold text-white"
            >
              Join Newsletter
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:pt-10">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#ff2f8f]">
            Featured Books
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Start Your Next Obsession
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Protective heroes. Impossible choices. Unforgettable romance.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {books.slice(0, 4).map((book) => (
            <div
              key={book.slug}
              className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 transition duration-300 hover:-translate-y-1 hover:border-[#ff2f8f]"
            >
              <Image
                src={book.cover}
                alt={`${book.title} book cover`}
                width={400}
                height={600}
                className="aspect-[2/3] w-full object-cover"
              />

              <div className="p-5">
                <h3 className="text-lg font-semibold">{book.title}</h3>

                <p className="mt-2 text-sm text-zinc-400">
                  {book.subgenre}
                </p>

                <Link
                  href={book.amazon}
                  className="mt-5 inline-block rounded-full bg-[#ff2f8f] px-5 py-2 text-sm font-semibold text-black"
                >
                  View on Amazon
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
