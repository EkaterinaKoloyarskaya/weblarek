export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export type TPayment = "card" | "cash";

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export type TProductResponse = {
  total: number;
  items: IProduct[];
};

export type TOrderResponse = {
  id: string;
  total: number;
};

export interface TOrderRequest extends IBuyer {
  total: number;
  items: string[];
};

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | '';
  email: string;
  phone: string;
  address: string;
}
