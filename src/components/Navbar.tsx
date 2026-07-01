"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/about", label: "About" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/70 bg-black/90 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="transition hover:opacity-80">
          <Image
            src="/marlow-logo.jpg"
            alt="Marlow Quinn"
            width={70}
            height={70}
            priority
          />
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-3xl text-white md:hidden"
          aria-label="Open navigation menu"
        >
          ☰
        </button>

        <div className="hidden items-center gap-8 text-sm font-medium uppercase tracking-[0.2em] md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "border-b border-[#ff2f8f] pb-1 text-[#ff2f8f]"
                    : "border-b border-transparent pb-1 text-zinc-300 hover:text-[#ff2f8f]"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {isOpen && (
        <div className="border-t border-zinc-800 bg-black px-6 py-6 md:hidden">
          <div className="flex flex-col gap-5 text-sm font-medium uppercase tracking-[0.25em]">
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={isActive ? "text-[#ff2f8f]" : "text-zinc-300"}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
