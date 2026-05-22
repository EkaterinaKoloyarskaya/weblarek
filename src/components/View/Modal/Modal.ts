import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  contentElement: HTMLElement;
  closeButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );

    this.container.addEventListener("click", () => {
      this.close();
    });

    this.closeButton.addEventListener("click", () => {
      
    });

    this.contentElement.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  set content(content: HTMLElement) {
    this.contentElement.replaceChildren(content);
  }

  open() {
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
    this.contentElement.innerHTML = "";

    this.events.emit("modal: close");
  }
}
