import { IProduct } from "../../../types/index.ts";

export class Basket {
  protected catalogBasket: IProduct[] = [];

  constructor() {
    this.catalogBasket = [];
  }

  getCatalog(): IProduct[] {
    return this.catalogBasket;
  }

  addProduct(product: IProduct) {
    this.catalogBasket.push(product);
  }

  removeProduct(id: string) {
    this.catalogBasket = this.catalogBasket.filter((item) => {
      return item.id !== id;
    });
  }

  getAllPrice(): number {
    return this.catalogBasket.reduce((res, item) => {
      if (item.price !== null) {
        return res + item.price;
      }
      return res;
    }, 0);
  }

  getQuantityProduct(id: string): number {
    return this.catalogBasket.filter((item) => item.id === id).length;
  }

  checkProductBasket(id: string): boolean {
    return this.catalogBasket.some((item) => item.id === id);
  }

  clear() {
    this.catalogBasket = [];
  }
}
