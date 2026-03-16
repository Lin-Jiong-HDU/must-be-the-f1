// types/content.ts
export type ContentType = 'news' | 'race' | 'guide' | 'library';

export interface Frontmatter {
  title: string;
  type: ContentType;
  slug: string;
  date: string;
  cover?: string;
  tags?: string[];
  excerpt?: string;
  track?: string;
  season?: number;
  round?: number;
}

export interface Article extends Frontmatter {
  content: string;
}

export interface Track {
  id: string;
  name: string;
  officialName: string;
  location: string;
  country: string;
  length: number;
  laps: number;
  turns: number;
  coordinates: [number, number];
  firstHeld: number;
  trackImage: string;
}

export interface RaceEvent {
  round: number;
  track: string;
  name: string;
  date: string;
  sprint?: boolean;
  race?: string;
}

export interface Calendar {
  [year: string]: RaceEvent[];
}
