import { NextResponse } from "next/server";

import { books } from "@/data/books";

export const runtime = "nodejs";

const SITE_ORIGIN = "https://www.marlowquinn.com";

function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, SITE_ORIGIN).toString();
}

function asinFromAmazonUrl(amazonUrl: string): string | null {
  return amazonUrl.match(/\/dp\/([A-Z0-9]{10})(?:[/?#]|$)/i)?.[1] ?? null;
}

export async function GET() {
  const catalogue = books.map((book) => ({
    slug: book.slug,
    title: book.title,
    subgenre: book.subgenre,
    blurb: book.blurb,
    tropes: book.tropes,
    heat: book.heat,
    length: book.length,
    ending: book.ending,
    contentWarnings: book.contentWarnings,
    kindleUnlimited: book.ku,
    asin: asinFromAmazonUrl(book.amazon),
    amazonUrl: book.amazon,
    coverUrl: absoluteUrl(book.cover),
    bookPageUrl: absoluteUrl(`/books/${book.slug}`),
  }));

  return NextResponse.json(
    {
      schemaVersion: 1,
      source: SITE_ORIGIN,
      count: catalogue.length,
      books: catalogue,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control":
          "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
