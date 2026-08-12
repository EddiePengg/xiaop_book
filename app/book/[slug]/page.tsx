import { notFound } from "next/navigation";
import { getAllSlugs, getBookBySlug } from "@/lib/books";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import AudioPlayer from "@/components/AudioPlayer";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

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

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  return (
    <div className="detail-wrap">
      <a href="/" className="back-link">← 返回列表</a>

      <div className="detail-hero">
        {book.hasCover ? (
          <img src={book.coverUrl} alt={book.title} className="detail-cover" />
        ) : (
          <div className="detail-cover-placeholder">📖</div>
        )}
        <div className="detail-info">
          <h1 className="detail-title">{book.title}</h1>
          <p className="detail-author">{book.author}</p>
          <div className="detail-meta-row">
            {(() => {
              const r = safeRating(book.rating);
              return r != null ? (
                <span className={`detail-rating ${ratingClass(r)}`}>
                  ⭐ {r.toFixed(1)}
                </span>
              ) : null;
            })()}
            <span className="detail-date">📅 {book.date}</span>
          </div>
          {book.tags && book.tags.length > 0 && (
            <div className="book-card-tags" style={{ marginTop: 12 }}>
              {book.tags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {book.hasPodcast && book.podcastUrl ? (
        <AudioPlayer src={book.podcastUrl} title={book.podcast_title} />
      ) : (
        <p className="no-podcast-note">此书暂无播客音频</p>
      )}

      <MarkdownRenderer content={book.report} />
    </div>
  );
}
