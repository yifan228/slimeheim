import { getAllBooks, getAllNotes } from "@/lib/notes";
import NotesClient from "./NotesClient";

export default function NotesPage() {
  const books = getAllBooks();
  const notes = getAllNotes().map(n => ({
    slug: n.slug,
    bookSlug: n.bookSlug,
    titles: n.titles,
    tags: n.tags,
    availableLangs: n.availableLangs,
  }));

  return (
    <main style={{ background: "#000", minHeight: "100vh", fontFamily: "monospace", padding: "24px" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <NotesClient books={books} notes={notes} />
      </div>
    </main>
  );
}
