import "./scss/styles.scss";
import { apiProducts } from "./utils/data.ts";
import { Basket } from "./components/Models/Basket/Basket.ts";
import { Buyer } from "./components/Models/Buyer/Buyer.ts";
import { CatalogProduct } from "./components/Models/CatalogProduct/CatalogProduct.ts";
import { ApiService } from "./components/Communication/ApiService.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";



const catalog = new CatalogProduct();
catalog.saveCatalog(apiProducts.items);
console.log("Каталог:", catalog.getCatalog());
catalog.saveSelectedProduct({
  id: "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
  description:
    "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
  image: "/Shell.svg",
  title: "HEX-леденец",
  category: "другое",
  price: 1450,
});
console.log(
  "Получение продукта по id:",
  catalog.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390")
);
console.log("Выбранный продукт:", catalog.getSelectedProduct());




const basket = new Basket();
basket.addProduct({
  id: "854cef69-976d-4c2a-a18c-2aa45046c390",
  description: "Если планируете решать задачи в тренажёре, берите два.",
  image: "/5_Dots.svg",
  title: "+1 час в сутках",
  category: "софт-скил",
  price: 750,
});
basket.addProduct({
    "id": "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
    "description": "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
    "image": "/Shell.svg",
    "title": "HEX-леденец",
    "category": "другое",
    "price": 1450
});
basket.addProduct({
    "id": "412bcf81-7e75-4e70-bdb9-d3c73c9803b7",
    "description": "Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.",
    "image": "/Soft_Flower.svg",
    "title": "Фреймворк куки судьбы",
    "category": "дополнительное",
    "price": 2500
})
console.log("Каталог корзины:", basket.getCatalog());
console.log("Общая стоимость товаров:", basket.getAllPrice());
console.log(
  "Количество товаров:",
  basket.getAllProducts()
);
console.log(
  "Наличие товара в корзине:",
  basket.checkProductInBasket("854cef69-976d-4c2a-a18c-2aa45046c390")
);
basket.removeProduct("854cef69-976d-4c2a-a18c-2aa45046c390");
console.log(
  "Количество товаров:",
  basket.getAllProducts()
);
basket.clear();




const buyer = new Buyer();
buyer.saveDataBuyer({
  payment: "cash",
  address: "Moskva",
  phone: "+70875432345",
  email: "de@frf.ru",
});
console.log("Получены данные покупателя:", buyer.getDataBuyer());
console.log("Валидность данных:", buyer.validateDataBuyer());
buyer.clearDataBuyer();





const api = new Api(API_URL);
const apiData = new ApiService(api);

apiData
  .getProduct()
  .then((data) => {
    console.log("Данные заказа:", data);
  })
  .catch((err) => {
    console.log(err);
  });

apiData
  .postProduct({
    payment: "card",
    email: "test@test.ru",
    phone: "+71234567890",
    address: "Spb Vosstania 1",
    total: 2200,
    items: [
      "854cef69-976d-4c2a-a18c-2aa45046c390",
      "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
    ],
  })
  .then((data) => {
    console.log("Результат создания заказа:", data);
  })
  .catch((err) => {
    console.log(err);
  });
