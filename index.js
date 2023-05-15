// variables and constants
const cartContainer = document.querySelector('.modal-body');
const productList = document.querySelector('.row-products');
const cartList = document.querySelector('.row-cart');
const cartTotalValue = document.getElementById('cart-total-value');
const cartCountInfo = document.getElementById('cart-count');
const cartCountModal = document.getElementById('cart-qty');
const cartBuy = document.getElementById('cart-buy');
let cartItemID = 1;

let modal = document.getElementById("myModal");
let btn = document.getElementById("myBtn");
let span = document.getElementsByClassName("close")[0];

// auto slideshow
var counter = 1;
    setInterval(function(){
      document.getElementById('radio' + counter).checked = true;
      counter++;
      if(counter > 5){
        counter = 1;
      }
    }, 5000);

eventListeners();

// all event listeners
function eventListeners(){

    console.log("event listeners in"); 
    window.addEventListener('DOMContentLoaded', () => {
        loadJSON();
        loadCart();
    });

    // show/hide cart container
    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
    }
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }

    // add to cart
    productList.addEventListener('click', purchaseProduct);

    // delete from cart
    cartList.addEventListener('click', deleteProduct);

    // buy items in cart
    cartBuy.addEventListener('click', buyProducts);

}

// update cart info
function updateCartInfo(){
    let cartInfo = findCartInfo();
    cartCountInfo.textContent = cartInfo.productCount;
    cartCountModal.textContent = cartInfo.productCount;
    cartTotalValue.textContent = cartInfo.total;
}

// load product items content form JSON file
function loadJSON(){
    fetch('product.json')
    .then(response => response.json())
    .then(data =>{
        let html = '';        
        data.forEach(product => {
            console.log(product);
            html += `
                <div class="col-3">
                    <div class="product-img">
                        <img src="${product.image}">
                    </div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">$${product.price}</p>
                    <div class="description">
                        <div class="item-hidden">
                            <p>
                            <b>CPU&nbsp;:</b>&nbsp;${product.cpu}<br>
                            <b>GPU&nbsp;:</b>&nbsp;${product.gpu}<br>
                            <b>ROM&nbsp;:</b>&nbsp;${product.storage}<br>
                            <b>RAM&nbsp;:</b>&nbsp;${product.memory}
                            </p>
                        </div>
                        <div class="item-hidden">
                            <button class="buy">Add to Cart</a>
                        </div>
                    </div>
                </div>
            `;
        });
        productList.innerHTML = html;
    })
    .catch(error => {
        alert(`User live server or local server`);
        //URL scheme must be "http" or "https" for CORS request. You need to be serving your index.html locally or have your site hosted on a live server somewhere for the Fetch API to work properly.
    })
}


// purchase product
function purchaseProduct(e){
    if(e.target.classList.contains('buy')){
        console.log("buy is pressed");
        let product = e.target.parentElement.parentElement.parentElement;
        console.log(product);
        getProductInfo(product);
    }
}

// get product info after add to cart button click
function getProductInfo(product){
    console.log("get product");
    let productInfo = {
        id: cartItemID,
        image: product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').textContent,
        price: product.querySelector('.product-price').textContent
    }
    cartItemID++;
    console.log(productInfo);
    addToCartList(productInfo);
    saveProductInStorage(productInfo);
    alert(productInfo.name +" is added to your cart.");
}

// add the selected product to the cart list
function addToCartList(product){
    const cartItem = document.createElement('div');
    cartItem.classList.add('col-cart');
    cartItem.setAttribute('data-id', `${product.id}`);
    cartItem.innerHTML = `
        <img src = "${product.image}" alt = "product image">
            <h3 class = "cart-item-name">${product.name}</h3>
            <span class = "cart-item-price">${product.price}</span>
        </div>
        <button type = "button" class = "cart-item-del-btn">
            <i class = "fas fa-times">remove cart item</i>
        </button>
    `;
    cartList.appendChild(cartItem);
}

// save the product in the local storage
function saveProductInStorage(item){
    let products = getProductFromStorage();
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products));
    updateCartInfo();
}

// get all the products info if there is any in the local storage
function getProductFromStorage(){
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    // returns empty array if there isn't any product info
}

// load carts product
function loadCart(){
    let products = getProductFromStorage();
    if(products.length < 1){
        cartItemID = 1; // if there is no any product in the local storage
    } else {
        cartItemID = products[products.length - 1].id;
        cartItemID++;
        // else get the id of the last product and increase it by 1
    }
    products.forEach(product => addToCartList(product));

    // calculate and update UI of cart info 
    updateCartInfo();
}

// calculate total price of the cart and other info
function findCartInfo(){
    let products = getProductFromStorage();
    let total = products.reduce((acc, product) => {
        let price = parseFloat(product.price.substr(1)); // removing dollar sign
        return acc += price;
    }, 0); // adding all the prices

    return{
        total: total.toFixed(2),
        productCount: products.length
    }
}

// delete product from cart list and local storage
function deleteProduct(e){
    let cartItem;
    if(e.target.tagName === "BUTTON"){
        cartItem = e.target.parentElement;
        cartItem.remove(); // this removes from the DOM only
    } else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove(); // this removes from the DOM only
    }

    let products = getProductFromStorage();
    let updatedProducts = products.filter(product => {
        return product.id !== parseInt(cartItem.dataset.id);
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // updating the product list after the deletion
    updateCartInfo();
}

function buyProducts(){
    let contents = findCartInfo();
    if(contents.productCount !== null){
        if(contents.productCount !== 0){
            localStorage.clear();
            updateCartInfo();
            alert("Thank you for your patronage.");
            window.location.reload();
        }else{
            alert("No items in cart.");
        }
    }else{
        alert("No items in cart.");
    }
}


