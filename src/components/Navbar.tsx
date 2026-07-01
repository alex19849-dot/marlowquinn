"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/70 bg-black/80 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="transition hover:opacity-80">
          <Image
            src="/marlow-logo.png"
            alt="Marlow Quinn"
            width={70}
            height={70}
            priority
          />
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium uppercase tracking-[0.2em]">
          <Link className="text-zinc-300 hover:text-[#ff2f8f]" href="/">Home</Link>
          <Link className="text-zinc-300 hover:text-[#ff2f8f]" href="/books">Books</Link>
          <Link className="text-zinc-300 hover:text-[#ff2f8f]" href="/about">About</Link>
          <Link className="text-zinc-300 hover:text-[#ff2f8f]" href="/newsletter">Newsletter</Link>
          <Link className="text-zinc-300 hover:text-[#ff2f8f]" href="/contact">Contact</Link>
        </div>
      </nav>
    </header>
  );
}
