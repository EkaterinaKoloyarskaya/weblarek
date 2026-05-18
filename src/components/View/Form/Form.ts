import { Component } from "../../base/Component";
import { ensureElement, cloneTemplate } from "../../../utils/utils.ts";
import { IEvents } from "../../base/Events.ts";

export abstract class Form<T> extends Component<T> {
  form: HTMLFormElement;
  errorElement: HTMLElement;
  continueButton: HTMLButtonElement;

  constructor(protected events: IEvents, template: string) {
    const formTemplate = cloneTemplate<HTMLFormElement>(template);
    super(formTemplate);

    this.form = formTemplate;
    this.errorElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container
    );
    this.continueButton = ensureElement<HTMLButtonElement>(
      ".button",
      this.container
    );

    this.form.addEventListener("submit", (e) => {
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
