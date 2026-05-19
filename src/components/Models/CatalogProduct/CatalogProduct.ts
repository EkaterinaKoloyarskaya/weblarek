import { IProduct } from "../../../types/index.ts";
import { IEvents } from "../../base/Events.ts";

export class CatalogProduct {
  protected products: IProduct[];
  protected product: IProduct | null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this.products = [];
    this.product = null;
  }

  saveCatalog(catalog: IProduct[]) {
    this.products = catalog;

    this.events.emit('catalog: updated', catalog);
  }

  getCatalog(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    const selected = this.products.find((item) => {
      return item.id === id;
    });
    return selected;
  }

  saveSelectedProduct(item: IProduct) {
    this.product = item;

    this.events.emit('product: selected', item);
  }

  getSelectedProduct(): IProduct | null {
    return this.product;
  }
}
