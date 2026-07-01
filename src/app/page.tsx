import Image from "next/image";
import Link from "next/link";
import { books } from "@/data/books";

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#050505] text-white">
      <section className="relative px-6 py-8 sm:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,47,143,0.2),transparent_35%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="text-center lg:text-left">
            <Image
              src="/marlow-logo.png"
              alt="Marlow Quinn Author Logo"
              width={900}
              height={450}
              priority
              className="mx-auto w-full max-w-[340px] sm:max-w-[430px] lg:mx-0 lg:max-w-[500px]"
            />

            <p className="mt-4 text-lg text-zinc-200 sm:text-xl">
              Emotional MM Romance with bite, heat, and heart.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/books"
                className="rounded-full bg-[#ff2f8f] px-7 py-3 text-center font-semibold text-black"
              >
                Browse Books
              </Link>

              <Link
                href="/newsletter"
                className="rounded-full border border-zinc-700 px-7 py-3 text-center font-semibold text-white"
              >
                Join Newsletter
              </Link>
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#ff2f8f]">
                  Featured Books
                </p>
                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Start Your Next Obsession
                </h2>
              </div>

              <Link
                href="/books"
                className="hidden text-sm font-semibold text-zinc-300 hover:text-[#ff2f8f] sm:block"
              >
                View all
              </Link>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-4">
              {books.slice(0, 6).map((book) => (
                <Link
                  key={book.slug}
                  href={book.amazon}
                  className="group min-w-[170px] sm:min-w-[210px]"
                >
                  <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition duration-300 group-hover:-translate-y-1 group-hover:border-[#ff2f8f]">
                    <Image
                      src={book.cover}
                      alt={`${book.title} book cover`}
                      width={400}
                      height={600}
                      className="aspect-[2/3] w-full object-cover"
                    />
                  </div>

                  <h3 className="mt-3 text-sm font-semibold sm:text-base">
                    {book.title}
                  </h3>

                  <p className="mt-1 text-xs text-zinc-400">
                    {book.subgenre}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
