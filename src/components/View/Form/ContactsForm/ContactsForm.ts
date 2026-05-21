import { Form } from "../Form.ts";
import { ensureElement } from "../../../../utils/utils.ts";
import { IEvents } from "../../../base/Events.ts";

type TContactsForm = {
  email: string;
  phone: string;
};

export class ContactsForm extends Form<TContactsForm> {
  emailInput: HTMLInputElement;
  phoneInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );

    this.emailInput.addEventListener("input", () => {
      this.events.emit("input: email", {
        value: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("input: phone", {
        value: this.phoneInput.value,
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
    this.phoneInput.value = value;
  }
}
