import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface IOrderSuccess {
  amount: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  buttonSuccessClose: HTMLButtonElement;
  orderSuccessDescription: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.orderSuccessDescription = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );
    this.buttonSuccessClose = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );

    this.buttonSuccessClose.addEventListener("click", () => {
      this.events.emit("order: close");
    });
  }

  set amount(value: number) {
    this.orderSuccessDescription.textContent = `Списано ${value} синапсов`;
  }
}
