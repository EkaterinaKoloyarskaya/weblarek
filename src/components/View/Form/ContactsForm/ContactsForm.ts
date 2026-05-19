import { Form } from "../Form.ts";
import { ensureElement } from "../../../../utils/utils.ts";
import { IEvents } from "../../../base/Events.ts";

interface IContactsForm {
  email: string;
  number: string;
}

export class ContactsForm extends Form<IContactsForm> {
  emailInput: HTMLInputElement;
  numberInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );
    this.numberInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );

    this.emailInput.addEventListener("input", () => {
      this.events.emit("input: email", {
        value: this.emailInput.value,
      });
    });

    this.numberInput.addEventListener("input", () => {
      this.events.emit("input: phone", {
        value: this.numberInput.value,
      });
    });

    this.container.addEventListener("submit", () => {
      this.events.emit("contactsForm: submit");
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.numberInput.value = value;
  }
}
