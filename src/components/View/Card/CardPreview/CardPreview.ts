import { Card } from "../Card";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";
import { CDN_URL, categoryMap } from "../../../../utils/constants";

type TCardPreview = {
  description: string;
  price: number | null;
  category: string;
  image: string;
  buttonState: boolean;
};

export class CardPreview extends Card<TCardPreview> {
  cardText: HTMLElement;
  cardCategory: HTMLElement;
  addToBasketButton: HTMLButtonElement;
  imageElement: HTMLImageElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

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

    this.addToBasketButton.addEventListener("click", () => {
      this.events.emit("card: addToBasket");
    });
  }

  set description(value: string) {
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
  }
  set image(value: string) {
    this.setImage(this.imageElement, CDN_URL + value, this.title);
  }

  set buttonState(inBasket: boolean) {
    if (this.addToBasketButton.disabled) {
      this.addToBasketButton.textContent = "Недоступно";
      return;
    }

    this.addToBasketButton.textContent = inBasket
      ? "Удалить из корзины"
      : "В корзину";
  }
}
