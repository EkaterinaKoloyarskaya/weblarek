import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

type TCard = {
  id: string;
  title: string;
  price: number | null;
};

export abstract class Card<T> extends Component<T & TCard> {
  cardTitle: HTMLElement;
  cardPrice: HTMLElement;
  protected cardId!: string;

  constructor(container: HTMLElement) {
    super(container);

    this.cardTitle = ensureElement<HTMLElement>(".card__title", this.container);
    this.cardPrice = ensureElement<HTMLElement>(".card__price", this.container);
  }

  set id(value: string) {
    this.cardId = value;
  }

  set title(value: string) {
    this.cardTitle.textContent = value;
  }

  set price(value: number | null) {
    if (value) {
      this.cardPrice.textContent = `${value} синапсов`;
    } else {
      this.cardPrice.textContent = "Бесценно";
    }
  }
}
