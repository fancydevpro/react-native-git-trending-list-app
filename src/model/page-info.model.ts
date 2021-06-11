export interface PageInfo {
  pageSize: number;
  page: number;
  sort: 'stars' | 'name';
  order: 'desc' | 'asc';
  query: string;
}
