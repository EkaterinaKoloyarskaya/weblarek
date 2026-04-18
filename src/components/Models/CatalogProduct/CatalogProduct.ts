import { IProduct } from "../../../types/index.ts";

export class CatalogProduct {
  protected products: IProduct[];
  protected product: IProduct | null;

  constructor() {
    this.products = [];
    this.product = null;
  }

  saveCatalog(catalog: IProduct[]) {
    this.products = catalog;
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
  }

  getSelectedProduct(): IProduct | null {
    return this.product;
  }
}
