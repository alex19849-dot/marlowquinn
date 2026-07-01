import Image from "next/image";
import Link from "next/link";
import { books } from "@/data/books";

type BookPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;

  const book = books.find((item) => item.slug === slug);

  if (!book) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
        <section className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold">Book not found</h1>
          <Link
            href="/books"
            className="mt-8 inline-block rounded-full bg-[#ff2f8f] px-6 py-3 font-semibold text-black"
          >
            Back to Books
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-12 text-white">
      <section className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[380px_1fr]">
        <div>
          <Image
            src={book.cover}
            alt={`${book.title} book cover`}
            width={500}
            height={750}
            className="w-full rounded-2xl border border-zinc-800 object-cover"
            priority
          />
        </div>

        <div className="flex flex-col justify-center">
          <Link
            href="/books"
            className="mb-8 text-sm font-semibold uppercase tracking-[0.25em] text-[#ff2f8f]"
          >
            ← Back to Books
          </Link>

          <p className="text-sm uppercase tracking-[0.35em] text-[#ff2f8f]">
            {book.subgenre}
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-6xl">
            {book.title}
          </h1>

          {book.ku && (
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-zinc-300">
              Kindle Unlimited
            </p>
          )}
{"blurb" in book && (
  <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300">
    {book.blurb}
  </p>
)}
          <div className="mt-6 flex flex-wrap gap-2">
            {book.tropes.map((trope) => (
              <span
                key={trope}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300"
              >
                {trope}
              </span>
            ))}
          </div>

          <Link
            href={book.amazon}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 w-fit rounded-full bg-[#ff2f8f] px-8 py-3 font-semibold text-black"
          >
            View on Amazon
          </Link>
        </div>
      </section>
    </main>
  );
}
