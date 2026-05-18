import { Form } from "../Form.ts";
import { ensureElement } from "../../../../utils/utils.ts";
import { IEvents } from "../../../base/Events.ts";
import { TPayment } from "../../../../types/index.ts";

interface IOrderForm {
  payment: TPayment | "";
  address: string;
}

export class OrderForm extends Form<IOrderForm> {
  cardButton: HTMLButtonElement;
  cashButton: HTMLButtonElement;
  addressInput: HTMLInputElement;

  constructor(events: IEvents) {
    super(events, "#order");

    this.cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.form
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.form
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.form
    );

    this.cardButton.addEventListener("click", () => {
      this.events.emit("button: card");
    });

    this.cashButton.addEventListener("click", () => {
      this.events.emit("button: cash");
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("input: address", {
        value: this.addressInput.value,
      });
    });

    this.form.addEventListener("submit", () => {
      this.events.emit("orderForm: submit");
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set payment(value: TPayment | "") {
    this.cardButton.classList.toggle("button_alt-active", value === "card");
    this.cashButton.classList.toggle("button_alt-active", value === "cash");
  }
}
