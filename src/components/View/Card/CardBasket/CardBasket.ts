import { Card } from "../Card";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";
import { IProduct } from "../../../../types/index";

export class CardBasket extends Card {
  cardIndex: HTMLElement;
  cardDeleteButton: HTMLButtonElement;
  protected productId: string;

  constructor(protected events: IEvents, data: IProduct) {
    super("#card-basket");

    this.productId = data.id;

    this.title = data.title;
    this.price = data.price;
    this.cardIndex = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );
    this.cardDeleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );

    this.cardDeleteButton.addEventListener("click", () => {
      this.events.emit("basket: deleteCard", { id: this.productId });
    });
  }

  set index(value: number) {
    this.cardIndex.textContent = String(value);
  }
}
