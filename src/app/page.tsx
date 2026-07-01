import Image from "next/image";
import Link from "next/link";
import { books } from "@/data/books";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,47,143,0.22),transparent_35%)]" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <Image
            src="/marlow-logo.png"
            alt="Marlow Quinn Author Logo"
            width={900}
            height={450}
            priority
           className="mx-auto w-full max-w-2xl lg:max-w-[700px]"
          />

          <p className="mt-5 text-xl text-zinc-200 sm:text-2xl">
            Emotional MM Romance with bite, heat, and heart.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
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
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-zinc-500">
  Scroll
</div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-24">
  <div className="mb-12 text-center">
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
        className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 transition duration-300 hover:border-[#ff2f8f] hover:-translate-y-1"
      >
      <Image
  src={book.cover}
  alt={`${book.title} book cover`}
  width={400}
  height={600}
  className="aspect-[2/3] w-full object-cover"
/>
        <div className="p-5">
       <h3 className="text-lg font-semibold">
  {book.title}
</h3>

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
