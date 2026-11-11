import fs from "fs";
import path from "path";

export interface BookMeta {
  title: string;
  author: string;
  rating: number | null;
  date: string;
  podcast_title?: string;
  tags?: string[];
}

export interface Book extends BookMeta {
  slug: string; // folder name, e.g. "2026-08-07_斜杠青年"
  report: string; // markdown content
  hasCover: boolean;
  hasPodcast: boolean;
  coverUrl?: string; // /books/<slug>/cover.jpg
  podcastUrl?: string; // /books/<slug>/podcast.mp3
}

const BOOKS_DIR = path.join(process.cwd(), "books");

/**
 * Scan the books/ directory and return all book entries sorted by date desc.
 * Each subfolder is one book entry.
 */
export function getAllBooks(): Book[] {
  if (!fs.existsSync(BOOKS_DIR)) return [];

  const entries = fs
    .readdirSync(BOOKS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const books: Book[] = entries.map((slug) => readBook(slug)).filter(Boolean) as Book[];

  // Sort by date descending (newest first)
  books.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return books;
}

export function getBookBySlug(slug: string): Book | null {
  // Next.js may pass the slug URL-encoded; decode to match filesystem folder name.
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    /* keep original */
  }
  return readBook(decoded);
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BOOKS_DIR)) return [];
  return fs
    .readdirSync(BOOKS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function readBook(slug: string): Book | null {
  const dir = path.join(BOOKS_DIR, slug);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return null;

  // meta.json
  const metaPath = path.join(dir, "meta.json");
  let meta: BookMeta = { title: slug, author: "未知", rating: 0, date: "" };
  if (fs.existsSync(metaPath)) {
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    } catch {
      /* keep default */
    }
  }

  // report.md
  const reportPath = path.join(dir, "report.md");
  let report = "";
  if (fs.existsSync(reportPath)) {
    report = fs.readFileSync(reportPath, "utf-8");
  }

  // cover
  const coverFsPath = path.join(dir, "cover.jpg");
  const hasCover = fs.existsSync(coverFsPath);

  // podcast — 兼容 .mp3 和 .m4a (NotebookLM 默认输出 .m4a)
  const podcastMp3Path = path.join(dir, "podcast.mp3");
  const podcastM4aPath = path.join(dir, "podcast.m4a");
  const podcastFsPath = fs.existsSync(podcastMp3Path) ? podcastMp3Path
                       : fs.existsSync(podcastM4aPath) ? podcastM4aPath
                       : null;
  const hasPodcast = podcastFsPath !== null;
  const podcastExt = podcastFsPath ? path.extname(podcastFsPath).slice(1) : "mp3";

  return {
    ...meta,
    slug,
    report,
    hasCover,
    hasPodcast,
    coverUrl: hasCover ? `/books/${slug}/cover.jpg` : undefined,
    podcastUrl: hasPodcast ? `/books/${slug}/podcast.${podcastExt}` : undefined,
  };
}
