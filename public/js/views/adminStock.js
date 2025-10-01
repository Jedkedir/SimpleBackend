const main = document.querySelector("main");
const instock = document.querySelector(".instock");
const outstock = document.querySelector(".outstock");

function In_Stock(data) {
  data.forEach((stock) => {
    let product_tile = document.createElement("div");
    let title = document.createElement("h3");
    let imageTile = document.createElement("img");
    let buttonWrapper = document.createElement("div");
    let addButton = document.createElement("button");
    let val = document.createElement("p");
    let subButton = document.createElement("button");

    product_tile.classList.add("product_tile");
    buttonWrapper.classList.add("buttons");

    title.textContent = stock.name;
    imageTile.src = stock.image;
    addButton.addEventListener("click", () => {
      val.textContent = parseInt(val.textContent) + 1;
    });
    subButton.addEventListener("click", () => {
      if (val.textContent > 0) {
        val.textContent -= 1;
      }
    });
    addButton.textContent = "+";
    subButton.textContent = "-";
    addButton.style = "width:40px;";
    subButton.style = "width:40px;";
    val.textContent = stock.stock;

    buttonWrapper.style = "display:flex; gap:20px;";

    product_tile.appendChild(title);
    product_tile.appendChild(imageTile);
    buttonWrapper.appendChild(subButton);
    buttonWrapper.appendChild(val);
    buttonWrapper.appendChild(addButton);
    product_tile.appendChild(buttonWrapper);

    instock.appendChild(product_tile);
  });
}

function Out_stock(data) {
  data.forEach((stock) => {
    let product_tile = document.createElement("div");
    let title = document.createElement("h3");
    let image = document.createElement("img");
    let buttonWrapper = document.createElement("div");
    let addButton = document.createElement("button");
    let val = document.createElement("p");
    let subButton = document.createElement("button");

    product_tile.classList.add("product_tile");
    buttonWrapper.classList.add("buttons");

    title.textContent = stock.name;
    image.src = stock.image;
    addButton.addEventListener("click", () => {
      val.textContent = parseInt(val.textContent) + 1;
    });
    subButton.addEventListener("click", () => {
      if (val.textContent > 0) {
        val.textContent -= 1;
      }
    });
    addButton.textContent = "+";
    subButton.textContent = "-";
    addButton.style = "width:40px;";
    subButton.style = "width:40px;";
    val.textContent = stock.stock;

    buttonWrapper.style = "display:flex; gap:20px;";

    product_tile.appendChild(title);
    product_tile.appendChild(image);
    buttonWrapper.appendChild(subButton);
    buttonWrapper.appendChild(val);
    buttonWrapper.appendChild(addButton);
    product_tile.appendChild(buttonWrapper);
    outstock.appendChild(product_tile);
  });
}

data = [
  { name: "pants", stock: 10, image: "srscsd" },
  { name: "pants", stock: 10, image: "srscsd" },
  { name: "pants", stock: 10, image: "srscsd" },
  { name: "pants", stock: 10, image: "srscsd" },
  { name: "pants", stock: 10, image: "srscsd" },
  { name: "pants", stock: 10, image: "srscsd" },
];

In_Stock(data);
Out_stock(data);
