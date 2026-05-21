import { Card } from "../Card";
import { ensureElement } from "../../../../utils/utils";
import { CDN_URL, categoryMap } from "../../../../utils/constants";

type TCardCategory = {
  category: string;
  image: string;
};

export class CardCatalog extends Card<TCardCategory> {
  cardCatalogButton: HTMLButtonElement;
  cardCategory: HTMLElement;
  imageElement: HTMLImageElement;

  constructor(container: HTMLElement, handlers: { onClick: () => void }) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.cardCatalogButton = this.container as HTMLButtonElement;
    this.cardCategory = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );

    this.cardCatalogButton.addEventListener("click", handlers.onClick);
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    Object.values(categoryMap).forEach((className) => {
      this.cardCategory.classList.remove(className);
    });
    this.cardCategory.classList.add(categoryMap[value]);
  }

  set image(value: string) {
    this.setImage(this.imageElement, CDN_URL + value, this.title);
  }
}
