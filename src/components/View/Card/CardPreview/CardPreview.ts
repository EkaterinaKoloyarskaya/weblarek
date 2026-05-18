import { Card } from "../Card";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";
import { IProduct } from "../../../../types/index";
import { CDN_URL, categoryMap } from "../../../../utils/constants";

export class CardPreview extends Card {
  cardText: HTMLElement;
  cardCategory: HTMLElement;
  addToBasketButton: HTMLButtonElement;
  imageElement: HTMLImageElement;
  protected productId: string;

  constructor(protected events: IEvents, data: IProduct) {
    super("#card-preview");

    this.productId = data.id;

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.cardText = ensureElement<HTMLElement>(".card__text", this.container);
    this.cardCategory = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.addToBasketButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );
    this.setImage(this.imageElement, CDN_URL + data.image, data.title);
    this.title = data.title;
    this.category = data.category;
    this.price = data.price;
    this.text = data.description;

    this.addToBasketButton.addEventListener("click", () => {
      this.events.emit("card: addToBasket", { id: this.productId });
    });
  }
  set text(value: string) {
    this.cardText.textContent = value;
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    Object.values(categoryMap).forEach((className) => {
      this.cardCategory.classList.remove(className);
    });
    this.cardCategory.classList.add(categoryMap[value]);
  }

  set price(value: number | null) {
    super.price = value;
    const hasPrice = value !== null;
    this.addToBasketButton.disabled = !hasPrice;
    this.addToBasketButton.textContent = hasPrice ? "В корзину" : "Недоступно";
  }

  setButtonState(inBasket: boolean) {
    this.addToBasketButton.textContent = inBasket ? "Удалить из корзины" : "В корзину";
  }
}
