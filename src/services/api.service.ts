import { ApiRequest } from './api-request.service';
import { PageInfo } from '../model';

export async function apiGetRepositories({ pageSize, page, sort }: PageInfo) {
  const { data } = await ApiRequest<{
    items: {
      id: number;
      owner: {
        login: string;
        avatar_url: string;
      };
      name: string;
      description: string;
      language: string;
      stargazers_count: number;
      forks_count: number;
    }[];
  }>('/search/repositories', 'GET', {
    params: {
      q: 'trending',
      per_page: pageSize,
      sort,
      order: 'desc',
      page,
    },
  });

  return data;
}
