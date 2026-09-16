import { BaseInterface } from "./base";

export interface ProjectCategory extends BaseInterface {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

export interface ProjectCategoryPayload {
  name: string;
  description?: string;
  is_active?: boolean;
}

export type ProjectStatus = "draft" | "published" | "archived";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface Project extends BaseInterface {
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  category: string;
  category_name: string;
  author: string;
  author_name: string;
  status: ProjectStatus;
  published_at: string | null;
  is_featured: boolean;
  technologies: string;
  demo_url: string;
  repository_url: string;
  difficulty_level: DifficultyLevel | "";
  difficulty_level_display: string;
  price: string | null;
  is_purchasable: boolean;
}

export interface ProjectDetail extends Project {
  content: string;
}

export interface ProjectPayload {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  status?: ProjectStatus;
  is_featured?: boolean;
  technologies?: string;
  demo_url?: string;
  repository_url?: string;
  difficulty_level?: DifficultyLevel | "";
  price?: string;
  is_purchasable?: boolean;
}

export interface ProjectPagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
}

export interface ProjectCategoryPagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProjectCategory[];
}
