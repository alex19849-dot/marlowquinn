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
            className="text-[#ff2f8f] transition-colors duration-300 hover:text-white"
          >
            <FaFacebookF size={24} />
          </Link>

          <Link
            href="YOUR_BOOKBUB_URL"
            target="_blank"
            aria-label="BookBub"
            className="text-[#ff2f8f] transition-colors duration-300 hover:text-white"
          >
            <SiBookbub size={24} />
          </Link>

          <Link
            href="YOUR_TIKTOK_URL"
            target="_blank"
            aria-label="TikTok"
            className="text-[#ff2f8f] transition-colors duration-300 hover:text-white"
          >
            <FaTiktok size={24} />
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          © 2026 Marlow Quinn. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
