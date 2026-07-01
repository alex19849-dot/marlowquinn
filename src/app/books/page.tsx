import Image from "next/image";
import Link from "next/link";
import { books } from "@/data/books";

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <section className="mx-auto max-w-7xl">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#ff2f8f]">
          Marlow Quinn Books
        </p>

        <h1 className="text-4xl font-bold sm:text-6xl">Books</h1>

        <p className="mt-6 max-w-2xl text-zinc-400">
          Dark, emotional MM romance with heat, tension, found family, and
          happily-ever-afters worth fighting for.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book) => (
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
                <h2 className="text-lg font-semibold">{book.title}</h2>

                <p className="mt-2 text-sm text-zinc-400">
                  {book.subgenre}
                </p>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {book.tropes.join(" • ")}
                </p>

               {book.ku && (
  <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#ff2f8f]">
    Kindle Unlimited
  </p>
)}

               <Link
  href={book.amazon}
  target="_blank"
  rel="noopener noreferrer"
 className="mt-5 block w-fit mx-auto rounded-full bg-[#ff2f8f] px-5 py-2 text-sm font-semibold text-black"
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
