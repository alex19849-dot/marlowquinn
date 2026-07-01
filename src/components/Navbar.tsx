"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/about", label: "About" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

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
    </header>
  );
}
