import { IProduct } from "../../../types/index.ts";
import { IEvents } from "../../base/Events.ts";

export class Basket {
  protected catalogBasket: IProduct[] = [];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  getCatalog(): IProduct[] {
    return this.catalogBasket;
  }

  addProduct(product: IProduct) {
    if (this.checkProductInBasket(product.id)) {
      return;
    }
    this.catalogBasket.push(product);
    this.events.emit("basket: changed");
  }

  removeProduct(id: string) {
    this.catalogBasket = this.catalogBasket.filter((item) => {
      return item.id !== id;
    });
    this.events.emit("basket: changed");
  }

  getAllPrice(): number {
    return this.catalogBasket.reduce((res, item) => res + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.catalogBasket.length;
  }

  checkProductInBasket(id: string): boolean {
    return this.catalogBasket.some((item) => item.id === id);
  }

  clear() {
    this.catalogBasket = [];
    this.events.emit("basket: changed");
  }
}
