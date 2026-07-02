import Link from "next/link";
import { FaFacebookF, FaTiktok } from "react-icons/fa";
import { SiBookbub } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-800">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex justify-center gap-6">
          <Link
            href="YOUR_FACEBOOK_URL"
            target="_blank"
            aria-label="Facebook"
            className="text-zinc-500 transition-colors duration-300 hover:text-[#ff2f8f]"
          >
            <FaFacebookF size={20} />
          </Link>

          <Link
            href="YOUR_BOOKBUB_URL"
            target="_blank"
            aria-label="BookBub"
            className="text-zinc-500 transition-colors duration-300 hover:text-[#ff2f8f]"
          >
            <SiBookbub size={20} />
          </Link>

          <Link
            href="YOUR_TIKTOK_URL"
            target="_blank"
            aria-label="TikTok"
            className="text-zinc-500 transition-colors duration-300 hover:text-[#ff2f8f]"
          >
            <FaTiktok size={20} />
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          © 2026 Marlow Quinn. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
