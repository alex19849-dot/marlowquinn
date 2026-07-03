import Image from "next/image";
import Link from "next/link";
import { books } from "@/data/books";

export default function Home() {
  const featuredSlugs = [
    "borrow-my-calm",
    "trouble-like-you",
    "executive-dysfunction",
    "after-sunset",
    "lost",
    "mine",
  ];

  const carouselBooks = [
    ...featuredSlugs.map(
      (slug) => books.find((book) => book.slug === slug)!
    ),
    ...featuredSlugs.map(
      (slug) => books.find((book) => book.slug === slug)!
    ),
  ];

  return (
   <main className="h-[calc(100vh-80px)] overflow-hidden bg-[#050505] px-4 py-4 text-white sm:px-6 sm:py-6">
      <section className="mx-auto flex max-w-7xl flex-col items-center text-center">
    <h1 className="text-3xl font-bold uppercase tracking-[0.22em] text-white sm:text-5xl">
  Marlow Quinn
</h1>

<p className="mt-2 text-xs uppercase tracking-[0.45em] text-[#ff2f8f]">
  Author
</p>

<p className="mx-auto mt-4 max-w-xl text-base leading-6 text-zinc-300 sm:text-lg">
  Emotional MM Romance with bite, heat, and heart.
</p>

        <div className="mt-6 w-full overflow-hidden">
          <div className="flex w-max animate-[scrollBooks_35s_linear_infinite] gap-6">
            {carouselBooks.map((book, index) => (
             <Link
key={`${book.slug}-${index}`}
href={`/books/${book.slug}`}
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

      <div className="mt-5 flex flex-row justify-center gap-3">
          <Link
            href="/books"
            className="rounded-full bg-[#ff2f8f] px-6 py-3 text-sm font-semibold text-black sm:px-8 sm:text-base"
          >
            Browse Books
          </Link>

          <Link
            href="/newsletter"
           className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-white sm:px-8 sm:text-base"
          >
            Join Newsletter
          </Link>
        </div>
      </section>
    </main>
  );
}
