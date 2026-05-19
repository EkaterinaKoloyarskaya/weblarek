import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";

interface IBasketData {
  items: IProduct[];
  price: number;
}

export class BasketContainer extends Component<IBasketData> {
  listItems: HTMLElement;
  orderButton: HTMLButtonElement;
  totalPrice: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.listItems = ensureElement<HTMLElement>(
      ".basket__list",
      this.container
    );
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );
    this.totalPrice = ensureElement<HTMLElement>(
      ".basket__price",
      this.container
    );

    this.orderButton.addEventListener("click", () => {
      this.events.emit("basket: makeAnOrder");
    });
  }

  set items(items: HTMLElement[]) {
    this.listItems.replaceChildren(...items);
  }

  set price(value: number) {
    this.totalPrice.textContent = String(value);
  }

  set order(value: boolean) {
    this.orderButton.disabled = !value;
  }
}
