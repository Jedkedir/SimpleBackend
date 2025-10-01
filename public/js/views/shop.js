import { getShoppingPageData } from "../services/shopPageService.js"

const body = document.querySelector('body')
const main = document.querySelector('main')
const products = document.querySelector('.products')

const pageData = await getShoppingPageData()
try {
    if (pageData.success == false) {
      //console.log(pageData.error);
    } else {
      let grouped_by_id = group_by_product(pageData.data);
      let grouped_by_cat = group_by_category(grouped_by_id);
      product_category(grouped_by_cat);
    }
} catch (error) {
    console.log(error);
}

function product_category(grouped_by_cat) {
    for(const categ_key in grouped_by_cat){
        let productWrapper = document.createElement('div')
        let categoryTitle = document.createElement('h2')
        
        productWrapper.style = "display: flex; flex-direction: column; padding-left:2%;"
        categoryTitle.textContent = categ_key
        
        let product_scroll_tile = document.createElement('article')
        product_scroll_tile.classList.add("Product_scroll")

        grouped_by_cat[categ_key].forEach(groupedElements => {
            
            let product_tile = document.createElement('div')
            product_tile.classList.add('Product_box')

            let product_name = document.createElement('p')
            let product_price = document.createElement('p')

            let product_img = document.createElement('img')
            product_img.classList.add("Productimg")

            product_tile.addEventListener('click',()=>{
                 window.location.href = "/"+groupedElements[0]["product_id"]
            })

            product_img.src = groupedElements[0]["base_image_url"]
            product_name.textContent = groupedElements[0]["product_name"]
            product_price.textContent = groupedElements[0]["base_price"]
            
            product_tile.appendChild(product_img)
            product_tile.appendChild(product_name)
            product_tile.appendChild(product_price)
            product_tile.appendChild(product_price)
            product_scroll_tile.appendChild(product_tile)
        });
        productWrapper.appendChild(categoryTitle)
        productWrapper.appendChild(product_scroll_tile)
        products.appendChild(productWrapper)

    }
}
function group_by_product(response) {
    console.log(response)
   let  grouped = response.Products.reduce((accumulator, item) => {

        const id = item["product_id"];

        if (!accumulator[id]) {
            accumulator[id] = [];
        }
        accumulator[id].push(item);
        accumulator[id].category = item["category_name"]
        

        return accumulator;
    }, {});

    return grouped

}

function group_by_category(response) {
    let accumulator = {}
    for (const keys in response) {

        let item = response[keys]
        console.log(item)
        const category = item["category"];
        


        if (!accumulator[category]) {
            accumulator[category] = [];
        }
        accumulator[category].push(item);

        

    }
    return accumulator

}




