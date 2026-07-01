import Image from "next/image";
import Link from "next/link";

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
            className="mx-auto w-full max-w-3xl"
          />

          <p className="mt-8 text-xl text-zinc-200 sm:text-2xl">
            Emotional MM Romance with bite, heat, and heart.
          </p>

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
        </div>
      </section>
    </main>
  );
}
