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
import { cloneTemplate } from "./utils/utils.ts";
import { CatalogProduct } from "./components/Models/CatalogProduct/CatalogProduct.ts";
import { IProduct } from "./types/index.ts";

const events = new EventEmitter();
const api = new Api(API_URL);
const serviceApi = new ApiService(api);
const productModel = new CatalogProduct(events);

async function init() {
  try {
    const data = await serviceApi.getProduct();
    productModel.saveCatalog(data.items);
  } catch (err) {
    console.log(err);
  }
}
init();

const basketContainer = new BasketContainer(events, cloneTemplate<HTMLTemplateElement>("#basket"));

const header = new Header(events, document.querySelector(".header") as HTMLElement);
const gallery = new Gallery(document.querySelector(".gallery") as HTMLElement);
const modal = new Modal(events, document.querySelector(".modal") as HTMLElement);
const basketData = new Basket(events);
const buyer = new Buyer(events);
const cardPreview = new CardPreview(events, cloneTemplate<HTMLTemplateElement>("#card-preview"));
const orderForm = new OrderForm(events, cloneTemplate<HTMLTemplateElement>("#order"));
const orderSuccess = new OrderSuccess(events, cloneTemplate<HTMLElement>("#success"));

events.on("catalog: updated", () => {
  const data = productModel.getCatalog();
  const cards = data.map((item) => {
    const card = new CardCatalog(
      cloneTemplate<HTMLTemplateElement>("#card-catalog"),
      {
        onClick: () => {
          events.emit("card: previewCard", { id: item.id });
        },
      }
    );

    return card.render({
      title: item.title,
      price: item.price,
      image: item.image,
      category: item.category,
    });
  });
  gallery.catalog = cards;
});

function updateCardPreviewButton(price: number | null, inBasket: boolean) {
  const disabled = price === null;

  cardPreview.disabled = disabled;

  cardPreview.buttonText = disabled
    ? "Недоступно"
    : (inBasket ? "Удалить из корзины" : "В корзину");
}

events.on("basket: open", () => {
  modal.content = basketContainer.render();
  modal.open();
});

events.on("card: previewCard", (itemData: { id: string }) => {
  const cards = productModel.getCatalog();
  const card = cards.find((item) => item.id === itemData.id);
  if (!card) return;

  productModel.saveSelectedProduct(card);
})

events.on('product: selected', (card: IProduct) => {
  modal.content = cardPreview.render({
    title: card.title,
    price: card.price,
    image: card.image,
    description: card.description,
    category: card.category,
  });
  updateCardPreviewButton(
    card.price,
    basketData.checkProductInBasket(card.id)
  );
  modal.open();
});

events.on("basket: deleteCard", (itemData: { id: string }) => {
  basketData.removeProduct(itemData.id);
});

events.on("card: addToBasket", () => {
  const product = productModel.getSelectedProduct();

  if (!product) return;

  if (basketData.checkProductInBasket(product.id)) {
    basketData.removeProduct(product.id);
    modal.close();
  } else {
    basketData.addProduct(product);
    modal.close();
  }
});

events.on("basket: changed", () => {
  const items = basketData.getCatalog();
  const cards = items.map((item, index) => {
    const card = new CardBasket(
      cloneTemplate<HTMLTemplateElement>("#card-basket"),
      {
        onDelete: () => {
          events.emit("basket: deleteCard", { id: item.id });
        },
      }
    );

    return card.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  basketContainer.items = cards;

  basketContainer.price = basketData.getAllPrice();
  header.counter = basketData.getCount();
  basketContainer.order = basketData.getCount() > 0;
});

events.on("basket: makeAnOrder", () => {
  modal.content = orderForm.render();

  const selected = productModel.getSelectedProduct();
  if (selected) {
    updateCardPreviewButton(
      selected.price,
      basketData.checkProductInBasket(selected.id)
    );
  }
});

events.on("buyer:change", (data: { changedFields: string[] }) => {
  const state = buyer.getDataBuyer();

  const isEmpty = !state.payment && !state.address && !state.email && !state.phone;

  if (isEmpty) {
    orderForm.payment = "";
    orderForm.address = "";
    contactsForm.email = "";
    contactsForm.phone = "";

    orderForm.errors = [];
    contactsForm.errors = [];

    orderForm.valid = false;
    contactsForm.valid = false;
    return;
  }

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

const contactsForm = new ContactsForm(
  events,
  cloneTemplate<HTMLTemplateElement>("#contacts")
);
events.on("orderForm: submit", () => {
  modal.content = contactsForm.render();
});

events.on("input: email", ({ value }: { value: string }) => {
  buyer.saveDataBuyer({ email: value });
});

events.on("input: phone", ({ value }: { value: string }) => {
  buyer.saveDataBuyer({ phone: value });
});

events.on("contactsForm: submit", async () => {
  const orderData = {
    ...buyer.getDataBuyer(),
    items: basketData.getCatalog().map((item) => item.id),
    total: basketData.getAllPrice(),
  };

  try {
    const response = await serviceApi.postProduct(orderData);
    basketData.clear();
    buyer.clearDataBuyer();
    orderSuccess.amount = response.total;
    modal.content = orderSuccess.render();
  } catch (err) {
    console.log(err);
  }
});

events.on("order: close", () => {
  modal.close();
});
