import "./scss/styles.scss";
import { Basket } from "./components/Models/Basket/Basket.ts";
import { Buyer } from "./components/Models/Buyer/Buyer.ts";
import { ApiService } from "./components/Communication/ApiService.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";
import { EventEmitter } from "./components/base/Events.ts";
import { Header } from "./components/View/Header/Header.ts";
import { Gallery } from "./components/View/Gallery/Gallery.ts";
import { OrderForm } from "./components/View/Form/OrderForm/OrderForm.ts";
import { ContactsForm } from "./components/View/Form/ContactsForm/ContactsForm.ts";
import { Modal } from "./components/View/Modal/Modal.ts";
import { BasketContainer } from "./components/View/Basket/BasketContainer.ts";
import { CardCatalog } from "./components/View/Card/CardCatalog/CardCatalog.ts";
import { OrderSuccess } from "./components/View/OrderSuccess/OrderSuccess.ts";
import { CardBasket } from "./components/View/Card/CardBasket/CardBasket.ts";
import { CardPreview } from "./components/View/Card/CardPreview/CardPreview.ts";

const events = new EventEmitter();
const api = new Api(API_URL);
const serviceApi = new ApiService(api);
const data = await serviceApi.getProduct();

const basketContainer = new BasketContainer(events, "#basket");

const header = new Header(
  events,
  document.querySelector(".header") as HTMLElement
);
const gallery = new Gallery(document.querySelector(".gallery") as HTMLElement);
const modal = new Modal(
  events,
  document.querySelector(".modal") as HTMLElement
);

const basketData = new Basket(events);
const buyer = new Buyer(events);

const cards = data.items.map((item) => {
  const card = new CardCatalog(events, item);
  return card.render();
});
gallery.catalog = cards;

events.on("basket: open", () => {
  const items = basketData.getCatalog();
  const cards = items.map((item, index) => {
    const card = new CardBasket(events, item);
    card.index = index + 1;
    return card.render();
  });
  basketContainer.items = cards;
  modal.content = basketContainer.render();
  modal.open();
});

let currentPreviewId: string | null = null;

events.on("card: previewCard", (itemData: { id: string }) => {
  const card = data.items.find((item) => item.id === itemData.id);
  if (card) {
    currentPreviewId = card.id;
    const cardPreview = new CardPreview(events, card);
    const isInBasket = basketData.checkProductInBasket(card.id);
    cardPreview.setButtonState(isInBasket);
    modal.content = cardPreview.render();
    modal.open();
  }
});

events.on("basket: deleteCard", (itemData: { id: string }) => {
  basketData.removeProduct(itemData.id);
  const items = basketData.getCatalog();
  const cards = items.map((item, index) => {
    const card = new CardBasket(events, item);
    card.index = index + 1;
    return card.render();
  });
  basketContainer.price = basketData.getAllPrice();
  basketContainer.items = cards;
});

events.on("modal: close", () => {
  modal.close();
});

events.on("card: addToBasket", (itemData: { id: string }) => {
  const card = data.items.find((item) => item.id === itemData.id);
  if (!card) return;

  if (basketData.checkProductInBasket(card.id)) {
    basketData.removeProduct(card.id);
  } else {
    basketData.addProduct(card);
  }
});

events.on("basket: changed", () => {
  basketContainer.price = basketData.getAllPrice();
  header.counter = basketData.getAllProducts();

  if (currentPreviewId) {
    const card = data.items.find((item) => item.id === currentPreviewId);
    if (!card) return;
    const cardPreview = new CardPreview(events, card);
    const isInBasket = basketData.checkProductInBasket(card.id);
    cardPreview.setButtonState(isInBasket);
    modal.content = cardPreview.render();
  }
});

const orderForm = new OrderForm(events);
events.on("basket: makeAnOrder", () => {
  modal.content = orderForm.render();
});

events.on("buyer:change", (data: { changedFields: string[] }) => {
  const state = buyer.getDataBuyer();
  const { errors } = buyer.validateDataBuyer();
  if (data.changedFields.includes("payment")) {
    orderForm.payment = state.payment;
  }
  if (
    data.changedFields.includes("payment") ||
    data.changedFields.includes("address")
  ) {
    const orderErrors = [];
    if (errors.payment) orderErrors.push(errors.payment);
    if (errors.address) orderErrors.push(errors.address);
    orderForm.errors = orderErrors;
    orderForm.valid = !errors.payment && !errors.address;
  }
  if (
    data.changedFields.includes("email") ||
    data.changedFields.includes("phone")
  ) {
    const contactsError = [];
    if (errors.email) contactsError.push(errors.email);
    if (errors.phone) contactsError.push(errors.phone);
    contactsForm.errors = contactsError;
    contactsForm.valid = !errors.email && !errors.phone;
  }
});

events.on("button: card", () => {
  buyer.saveDataBuyer({ payment: "card" });
});

events.on("button: cash", () => {
  buyer.saveDataBuyer({ payment: "cash" });
});

events.on("input: address", ({ value }: { value: string }) => {
  buyer.saveDataBuyer({ address: value });
});

const contactsForm = new ContactsForm(events);
events.on("orderForm: submit", () => {
  modal.content = contactsForm.render();
});

events.on("input: email", ({ value }: { value: string }) => {
  buyer.saveDataBuyer({ email: value });
});

events.on("input: phone", ({ value }: { value: string }) => {
  buyer.saveDataBuyer({ phone: value });
});

const orderSuccess = new OrderSuccess(events, "#success");

events.on("contactsForm: submit", async () => {
  const orderData = {
    ...buyer.getDataBuyer(),
    items: basketData.getCatalog().map((item) => item.id),
    total: basketData.getAllPrice(),
  };

  try {
    await serviceApi.postProduct(orderData);
    basketData.clear();
    buyer.clearDataBuyer();
    orderSuccess.amount = orderData.total;
    modal.content = orderSuccess.render();
  } catch (err) {
    return err;
  }
});

events.on("order: close", () => {
  modal.close();
});
