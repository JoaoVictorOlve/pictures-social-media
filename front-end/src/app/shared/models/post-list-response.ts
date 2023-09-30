import { Post } from './post';

export interface PostListResponse {
  nextUrl: string | null;
  previousUrl: string | null;
  limit: number;
  offset: number;
  total: number;
  results: Post[];
}
