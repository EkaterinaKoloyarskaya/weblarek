import { IBuyer, TPayment, TBuyerErrors } from "../../../types/index.ts";

export class Buyer {
  protected payment: TPayment | "";
  protected address: string;
  protected phone: string;
  protected email: string;

  constructor() {
    this.payment = "";
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  saveDataBuyer(data: Partial<IBuyer>) {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
    if (data.email !== undefined) {
      this.email = data.email;
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

  validateDataBuyer(): { isValid: boolean; errors: TBuyerErrors } {
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
    return { isValid: Object.keys(errors).length === 0, errors };
  }
}
