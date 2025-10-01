const body = document.querySelector("body");
const main = document.querySelector("main");
const productScroll = document.querySelector(".Product_scroll");

function tile_factory(product) {
  let tile = document.createElement("article");
  let tile_image = document.createElement("img");
  let tile_name = document.createElement("span");
  let price = document.createElement("span");

  tile.classList.add("Product_box");
  tile_image.classList.add("Productimg");
  tile_image.src = product.image;
  tile_name.textContent = product.name;
  price.textContent = product.price;

  tile.addEventListener("click", () => {
    window.location.href = "/public/product.html?id=" + product.id;
  });

  tile.appendChild(tile_image);
  tile.appendChild(tile_name);
  tile.appendChild(price);
  productScroll.appendChild(tile);
  console.log("success");
}

product = {
  name: "savage",
  id: 100,
  price: 200,
  image: "sample/shirt.jpg",
};
product1 = {
  name: "undavage",
  id: 100,
  price: 200,
  image: "sample/shirt.jpg",
};
product2 = {
  name: "disavage",
  id: 100,
  price: 200,
  image: "sample/shirt.jpg",
};
product3 = {
  name: "don't be savage",
  id: 100,
  price: 200,
  image: "sample/shirt.jpg",
};
tile_factory(product);
tile_factory(product1);
tile_factory(product2);
tile_factory(product3);
tile_factory(product);
tile_factory(product1);
tile_factory(product2);
tile_factory(product3);

let shop_btn1 = document.querySelector(".shop-btn");
let shop_btn2 = document.querySelector(".shop-btn2");

shop_btn1.addEventListener("click", () => {
  window.location.href = "/public/shop.html";
});
shop_btn2.addEventListener("click", () => {
  window.location.href = "/public/shop.html";
});
