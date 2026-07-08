export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  isFeatured: boolean;
  rating: number;
}
