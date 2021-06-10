export interface RepositoryModel {
  id: number;
  avatar: string;
  owner: string;
  name: string;
  extended?: boolean;
  description?: string;
  language?: string;
  languageColor?: string;
  stars?: number;
  forks?: number;
}
