export interface RepositoryModel {
  id: number;
  avatar: string;
  owner: string;
  name: string;
  description?: string;
  language?: string;
  languageColor?: string;
  stars?: number;
  forks?: number;
}
