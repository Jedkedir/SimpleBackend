import { AddToCartPageData } from "../services/addToCartService.js"
import { getProductPageData } from "../services/productPageService.js"

const body = document.querySelector('body')
const main = document.querySelector('main')
const pname = document.querySelector('.product_name')
const details = document.querySelector('.Product_detail')
const image = document.querySelector('.Product_image')
const description = document.querySelector('.description')
const colors = document.querySelector('.colors')
const sizes = document.querySelector('#size')
const quantity = document.querySelector('.quantity')

const url = new URL(window.location.href);

console.log(url)
const params = new URLSearchParams(url.search);


const id = params.get('id');
try {
    console.log("hello" )

    const pageData = await getProductPageData(id)
        console.log(pageData)

    if (pageData.success){
        product_detail(pageData.data)

    }
    console.log(pageData.data)
} catch (error) {
    console.log(error)
}

function product_detail(product) {
    pname.textContent = product.Product[0].name
    description.textContent = product.Product[0].description
    image.src = product.image

    let selected_variant = product.Product[0].variant_id

    product.Product.forEach(color => {
        let img = document.createElement('img')
        img.src = color.color.src
        console.log(colors.src)
        img.addEventListener('click', () => {
            image.src = img.src
            selected_variant = color.variant_id
        })
        colors.appendChild(img  )
    });
    product.Product.forEach(size => {
        let s = document.createElement('option')
        s.value, s.textContent = size.size
        sizes.appendChild(s)
    })
    let num = document.querySelector(".num")
    let cartbtn = document.querySelector('.cart-btn')
    cartbtn.addEventListener('click',()=>{
        if (localStorage.getItem("userId")==null){
            let info = {
                userId: 2,//localStorage.getItem("userId"),
                variantId: selected_variant,
                quantity: num.value}
                console.log(info)
        }else{
            // windows.location.href = 
         }
        try {
            let info = {
                userId: 1,//localStorage.getItem("userId"),
                variantId: selected_variant,
                quantity: num.value}
                console.log(info)
            let result = AddToCartPageData(info)
            if (result.success){
                console.log('item ordered successfully')
            }else{
                console.log('item order failed')

            }
        } catch (error) {
            console.log(error)
        }
        }
       
    )
}

