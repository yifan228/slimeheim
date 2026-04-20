import { getAllBooks, getNotesByBook } from "@/lib/notes";
import { notFound } from "next/navigation";
import ChapterList from "./ChapterList";
import BookHeader from "./BookHeader";

export async function generateStaticParams() {
  const books = getAllBooks();
  return books.map(b => ({ book: b.slug }));
}

export default async function BookPage({ params }: { params: Promise<{ book: string }> }) {
  const { book: bookSlug } = await params;
  const books = getAllBooks();
  const book = books.find(b => b.slug === bookSlug);
  if (!book) notFound();

  const notes = getNotesByBook(bookSlug);

  return (
    <main style={{ background: "#000", minHeight: "100vh", fontFamily: "monospace", padding: "24px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <BookHeader
          bookTitle={book.title}
          author={book.author}
          description={book.description}
          noteCount={notes.length}
        />
        <ChapterList notes={notes} bookSlug={bookSlug} />
      </div>
    </main>
  );
}
