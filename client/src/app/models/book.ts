export interface Genre {
  _id: string;
  name: string;
}

export interface Book {
  _id: string;
  title: string;
  description: string;
  author: string;
  year: number;
  genres: Genre[];
  bookFileName: string;
  thumbnailFileName: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}
