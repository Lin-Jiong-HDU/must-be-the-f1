// lib/content.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Article, Frontmatter, ContentType } from '@/types/content';

const CONTENT_DIR = path.join(process.cwd(), 'content/zh');

export function getContent(type: ContentType, slug: string): Article | null {
  try {
    const filePath = path.join(CONTENT_DIR, type, `${slug}.md`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    return { ...(data as Frontmatter), content };
  } catch {
    return null;
  }
}

export function getAllContent(type: ContentType): Frontmatter[] {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf-8'));
      return data as Frontmatter;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllSlugs(type: ContentType): string[] {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
}

export function getContentByRound(type: ContentType, round: number): Article | null {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf-8'));
    if (data.round === round) {
      return { ...(data as Frontmatter), content };
    }
  }

  return null;
}

export function getAllRounds(type: ContentType): number[] {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf-8'));
      return data.round as number;
    })
    .filter(Boolean);
}
