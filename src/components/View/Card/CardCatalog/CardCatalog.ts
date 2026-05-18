import { Card } from "../Card";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";
import { IProduct } from "../../../../types/index";
import { CDN_URL, categoryMap } from "../../../../utils/constants";

export class CardCatalog extends Card {
  cardCatalogButton: HTMLButtonElement;
  cardCategory: HTMLElement;
  imageElement: HTMLImageElement;
  protected productId: string;

  constructor(protected events: IEvents, data: IProduct) {
    super("#card-catalog");

    this.productId = data.id;
    this.title = data.title;
    this.price = data.price;

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.cardCatalogButton = this.container as HTMLButtonElement;
    this.cardCategory = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.setImage(this.imageElement, CDN_URL + data.image, data.title);
    this.category = data.category;

    this.cardCatalogButton.addEventListener("click", () => {
      this.events.emit("card: previewCard", { id: this.productId });
    });
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    Object.values(categoryMap).forEach((className) => {
      this.cardCategory.classList.remove(className);
    });
    this.cardCategory.classList.add(categoryMap[value]);
  }
}
