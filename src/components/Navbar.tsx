import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-zinc-800 bg-black">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-xl font-bold tracking-wide text-white"
        >
          Marlow Quinn
        </Link>

        <div className="flex gap-6 text-sm font-medium text-zinc-300">
          <Link href="/">Home</Link>
          <Link href="/books">Books</Link>
          <Link href="/about">About</Link>
          <Link href="/newsletter">Newsletter</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>
    </header>
  );
}
