export interface Project {
  id: number;
  /** URL-safe slug for routing, e.g. "specto" */
  slug: string;
  name: string;
  /** Short card description (3 lines max) */
  description: string;
  /** Full detailed description shown on the detail page */
  longDescription: string;
  stack: string[];
  /** Key features / highlights for the detail page */
  features: string[];
  github?: string;
  demo?: string;
  /** Tailwind gradient classes used for accent top-border */
  accentColor: string;
  /** URL for the project preview image (16:9) */
  image?: string;
  /** Development duration, e.g. "~3 недели" */
  devTime: string;
  /** Primary language reported by GitHub API */
  language: string;
  /** Approx repo created date */
  createdAt: string;
}

// static data removed
