export interface BookType {
  _id?: string;
  title: string;
  author: string;
  publishYear: number;
  image?: string;
  description: string;
}
  export interface PagModel {
    current: number;
    pageSize: number;
    total: number;
  }