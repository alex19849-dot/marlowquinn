import Image from "next/image";
import Link from "next/link";
import { books } from "@/data/books";

export default function Home() {
  const carouselBooks = [...books.slice(0, 6), ...books.slice(0, 6)];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] px-6 py-10 text-white">
      <section className="mx-auto flex max-w-7xl flex-col items-center text-center">
      <h1 className="text-5xl font-bold uppercase tracking-[0.18em] sm:text-7xl">
  Marlow Quinn
</h1>

<p className="mt-3 text-sm uppercase tracking-[0.45em] text-[#ff2f8f]">
  Author
</p>

<p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-zinc-200 sm:text-2xl">
  Emotional MM Romance with bite, heat, and heart.
</p>

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
