import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { books } from "@/data/books";

type BookPageProps = {
  params: Promise<{
    slug: string;
  }>;
};
export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = books.find((item) => item.slug === slug);

  if (!book) {
    return {
      title: "Book Not Found",
      description: "This Marlow Quinn book could not be found.",
    };
  }

  const description =
  "blurb" in book
    ? book.blurb
    : "Emotional MM romance by Marlow Quinn, available on Kindle Unlimited.";
  return {
    title: book.title,
    description,
    openGraph: {
      title: `${book.title} | Marlow Quinn`,
      description,
      type: "book",
      url: `/books/${book.slug}`,
      images: [
        {
          url: book.cover,
          width: 400,
          height: 600,
          alt: `${book.title} book cover`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${book.title} | Marlow Quinn`,
      description,
      images: [book.cover],
    },
  };
}
export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = books.find((item) => item.slug === slug);

  if (!book) {
    const bookSchema = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: book.title,
  author: {
    "@type": "Person",
    name: "Marlow Quinn",
  },
  genre: book.subgenre,
  image: `https://www.marlowquinn.com${book.cover}`,
  url: `https://www.marlowquinn.com/books/${book.slug}`,
  sameAs: book.amazon,
  description:
    "blurb" in book
      ? book.blurb
      : "Emotional MM romance by Marlow Quinn.",
};

return (
  <main className="min-h-screen bg-[#050505] px-6 py-12 text-white">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(bookSchema),
      }}
    />
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

  const hasBlurb = "blurb" in book;
  const hasContentWarnings = "contentWarnings" in book;
  const hasHeat = "heat" in book;
  const hasLength = "length" in book;
  const hasEnding = "ending" in book;

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

        <div>
          <Link
            href="/books"
            className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ff2f8f]"
          >
            ← Back to Books
          </Link>

          <p className="mt-8 text-sm uppercase tracking-[0.35em] text-[#ff2f8f]">
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

          {hasBlurb && (
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

          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ff2f8f]">
              Book Details
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Genre
                </p>
                <p className="mt-1 text-white">{book.subgenre}</p>
              </div>

              {hasHeat && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Heat
                  </p>
                  <p className="mt-1 text-[#ff2f8f]">{book.heat}</p>
                </div>
              )}

              {hasLength && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Length
                  </p>
                  <p className="mt-1 text-white">{book.length}</p>
                </div>
              )}

              {hasEnding && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Ending
                  </p>
                  <p className="mt-1 text-white">{book.ending}</p>
                </div>
              )}
            </div>
          </div>

          {hasContentWarnings && (
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ff2f8f]">
                Content Warnings
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {book.contentWarnings?.map((warning) => (
                  <span
                    key={warning}
                    className="rounded-full bg-black px-4 py-2 text-sm text-zinc-300"
                  >
                    {warning}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Link
            href={book.amazon}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 block w-fit rounded-full bg-[#ff2f8f] px-8 py-3 font-semibold text-black mx-auto lg:mx-0"
          >
            View on Amazon
          </Link>
        </div>
      </section>
    </main>
  );
}
