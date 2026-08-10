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
            {book.rating != null && (
              <span className={`detail-rating ${ratingClass(book.rating)}`}>
                ⭐ {book.rating.toFixed(1)}
              </span>
            )}
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
