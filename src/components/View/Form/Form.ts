import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils.ts";
import { IEvents } from "../../base/Events.ts";

export abstract class Form<T> extends Component<T> {
  errorElement: HTMLElement;
  continueButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.errorElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container
    );
    this.continueButton = ensureElement<HTMLButtonElement>(
      ".button",
      this.container
    );

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("order: submit");
    });
  }

  set valid(value: boolean) {
    this.continueButton.disabled = !value;
  }

  set errors(value: string[]) {
    this.errorElement.textContent = value.join(", ");
  }
}
