import {
  IApi,
  TProductResponse,
  TOrderRequest,
  TOrderResponse,
} from "../../types";

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProduct(): Promise<TProductResponse> {
    return this.api.get<TProductResponse>("/product");
  }

  postProduct(data: TOrderRequest): Promise<TOrderResponse> {
    return this.api.post<TOrderResponse>("/order", data);
  }
}
