import { IBuyer, TPayment, TBuyerErrors } from "../../../types/index.ts";

export class Buyer {
  protected payment: TPayment;
  protected address: string;
  protected phone: string;
  protected email: string;

  constructor() {
    this.payment = "";
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  saveDataBuyer(data: IBuyer) {
    this.payment = data.payment;
    this.address = data.address;
    this.phone = data.phone;
    this.email = data.email;
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
    let errors: TBuyerErrors = {};

    if (this.payment === "") {
      errors.payment = "Cпособ оплаты не выбран";
    }
    if (this.address === "") {
      errors.address = "Введите адрес доставки";
    }
    if (this.phone === "") {
      errors.phone = "Введите номер телефона";
    }
    if (this.email === "") {
      errors.email = "Введите почту";
    }
    if (Object.keys(errors).length === 0) {
      return { isValid: true, errors: {} };
    } else {
      return { isValid: false, errors: errors };
    }
  }
}
