import { Card } from "../Card";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";
import { IProduct } from "../../../../types/index";

type TCardBasket = {
  index: number;
}

export class CardBasket extends Card<TCardBasket> {
  cardIndex: HTMLElement;
  cardDeleteButton: HTMLButtonElement;
  

  constructor(container: HTMLElement, handlers: {onDelete: () => void}) {
    super(container);

    
    this.cardIndex = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );
    this.cardDeleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );

    this.cardDeleteButton.addEventListener("click", handlers.onDelete);
  }

  set index(value: number) {
    this.cardIndex.textContent = String(value);
  }
}
