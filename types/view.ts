import { ListItem, ProductItem } from '@/api/maskTypes';

export type Category = 'product' | 'company';
export type Status = 'reset' | 'update' | 'empty' | 'error';

export type SearchFormData = {
  keyword: string;
  category: Category;
};

export type SearchListData = {
  status: Status;
  currentPage: number;
  totalPage: number;
  list: [] | ListItem[];
};

export type SearchProductData = {
  status: Status;
  detail: {} | ProductItem;
};
