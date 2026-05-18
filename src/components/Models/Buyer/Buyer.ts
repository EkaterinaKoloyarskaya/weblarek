import { IBuyer, TPayment, TBuyerErrors } from "../../../types/index.ts";
import { IEvents } from "../../base/Events.ts";

export class Buyer {
  protected payment: TPayment | "";
  protected address: string;
  protected phone: string;
  protected email: string;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this.payment = "";
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  saveDataBuyer(data: Partial<IBuyer>) {
    const changedFields = [];

    if (data.payment !== undefined) {
      this.payment = data.payment;
      changedFields.push("payment");
    }
    if (data.address !== undefined) {
      this.address = data.address;
      changedFields.push("address");
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
      changedFields.push("phone");
    }
    if (data.email !== undefined) {
      this.email = data.email;
      changedFields.push("email");
    }

    if (changedFields.length != 0) {
      this.events.emit("buyer:change", { changedFields });
    }
  }

  getDataBuyer(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clearDataBuyer(): void {
    this.payment = "";
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  validateDataBuyer(): { errors: TBuyerErrors } {
    const errors: TBuyerErrors = {};

    if (!this.payment) {
      errors.payment = "Cпособ оплаты не выбран";
    }
    if (!this.address) {
      errors.address = "Введите адрес доставки";
    }
    if (!this.phone) {
      errors.phone = "Введите номер телефона";
    }
    if (!this.email) {
      errors.email = "Введите почту";
    }
    return { errors };
  }
}
