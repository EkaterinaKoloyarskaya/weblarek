import { IApi, TGet, TPostRequest, TPostResponse } from "../../types";

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProduct(): Promise<TGet> {
    return this.api.get<TGet>("/product");
  }

  postProduct(data: TPostRequest): Promise<TPostResponse> {
    return this.api.post<TPostResponse>("/order", data);
  }
}
