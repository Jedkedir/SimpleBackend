const body = document.querySelector('body')
const main = document.querySelector('main')
const pname = document.querySelector('.product_name')
const details = document.querySelector('.Product_detail')
const image = document.querySelector('.Product_image')
const description = document.querySelector('.description')
const colors  = document.querySelector('.colors')
const sizes  = document.querySelector('#size')
const quantity  = document.querySelector('.quantity')


function product_detail(product){
    pname.textContent = product.name
    description.textContent = product.description
    image.src = product.image

    product.colors.forEach(color=> {
        let img = document.createElement('img')
        img.src = color.src
        console.log( colors.src)
        img.addEventListener('click',()=>{
            image.src = img.src
        })
        colors.appendChild(img)
    });
    product.sizes.forEach(size=>{
        let s = document.createElement('option')
        s.value,s.textContent = size
        sizes.appendChild(s)
    }) 
}


product ={
    name: "savage",
    description: "Hello am under the water",
    image: "sample/shirt.jpg",
    colors: [{src:"sample/user.jpg"},{src:"sample/landing1.jpg"}],
    sizes: ['s','m','l']
}
product_detail(product)