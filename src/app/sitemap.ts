import { books } from "@/data/books";

export default function sitemap() {
  const baseUrl = "https://www.marlowquinn.com";

  const staticPages = ["", "/books", "/about", "/newsletter", "/contact", "/privacy", "/shop", "/shop/good-manners-filthy-bookshelf"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    })
  );

  const bookPages = books.map((book) => ({
    url: `${baseUrl}/books/${book.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...bookPages];
}
