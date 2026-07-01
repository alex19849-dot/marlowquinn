import Image from "next/image";
import Link from "next/link";
import { books } from "@/data/books";

export default function Home() {
  const carouselBooks = [...books.slice(0, 6), ...books.slice(0, 6)];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] px-6 py-10 text-white">
      <section className="mx-auto flex max-w-7xl flex-col items-center text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-[#ff2f8f]">
          Marlow Quinn Author
        </p>

        <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
          Emotional MM Romance with bite, heat, and heart.
        </h1>

        <div className="mt-10 w-full overflow-hidden">
          <div className="flex w-max animate-[scrollBooks_35s_linear_infinite] gap-6">
            {carouselBooks.map((book, index) => (
              <Link
                key={`${book.slug}-${index}`}
                href={book.amazon}
                className="w-[150px] shrink-0 sm:w-[190px] lg:w-[220px]"
              >
                <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
                  <Image
                    src={book.cover}
                    alt={`${book.title} book cover`}
                    width={400}
                    height={600}
                    className="aspect-[2/3] w-full object-cover"
                  />
                </div>

                <h2 className="mt-3 text-sm font-semibold">{book.title}</h2>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/books"
            className="rounded-full bg-[#ff2f8f] px-8 py-3 font-semibold text-black"
          >
            Browse Books
          </Link>

          <Link
            href="/newsletter"
            className="rounded-full border border-zinc-700 px-8 py-3 font-semibold text-white"
          >
            Join Newsletter
          </Link>
        </div>
      </section>
    </main>
  );
}
