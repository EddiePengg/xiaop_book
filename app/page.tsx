import { getAllBooks, type Book } from "@/lib/books";

function ratingClass(r: number): string {
  if (r >= 8) return "rating-high";
  if (r >= 6) return "rating-mid";
  return "rating-low";
}

function safeRating(r: unknown): number | null {
  if (r == null) return null;
  const n = typeof r === "string" ? parseFloat(r) : typeof r === "number" ? r : NaN;
  return isNaN(n) ? null : n;
}

export default function HomePage() {
  const books = getAllBooks();

  return (
    <div className="home-wrap">
      <h1 className="home-title">📚 小P的每日一书</h1>
      <p className="home-sub">
        每天一本好书的深度消化报告 · 共 {books.length} 本
      </p>
      <div className="book-grid">
        {books.map((book) => (
          <BookCard key={book.slug} book={book} />
        ))}
      </div>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <a href={`/book/${book.slug}`} className="book-card">
      {book.hasCover ? (
        <img
          src={book.coverUrl}
          alt={book.title}
          className="book-card-cover"
          loading="lazy"
        />
      ) : (
        <div className="book-card-placeholder">📖</div>
      )}
      <div className="book-card-body">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">{book.author}</p>
        <div className="book-card-meta">
          {(() => {
            const r = safeRating(book.rating);
            return r != null ? (
              <span className={`book-card-rating ${ratingClass(r)}`}>
                ⭐ {r.toFixed(1)}
              </span>
            ) : null;
          })()}
          <span className="book-card-date">{book.date}</span>
          {book.hasPodcast && <span className="book-card-podcast">🎙 播客</span>}
        </div>
        {book.tags && book.tags.length > 0 && (
          <div className="book-card-tags">
            {book.tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
