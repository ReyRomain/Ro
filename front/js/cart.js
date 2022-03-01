import {getCartContent, getProduct, removeProduct} from "./datamanager.js";

const cart = getCartContent();
console.log(cart);

async function showPage(){
    let product;
    let html = "";
    let total = 0;
    let articles = 0;
    for (const [idProduct, colors] of Object.entries(cart)){
        for (const [color, qty] of Object.entries(colors)){
            product = {
                ...await getProduct(idProduct),
                qty,
                color
            };
            html += templateProduct(product);
            total += product.price * qty;
            articles += qty;
        }
    }
    document.getElementById("cart__items").innerHTML = html;
    document.getElementById("totalPrice").innerHTML = total;
    document.getElementById("totalQuantity").innerHTML = articles;
}

showPage();

function templateProduct(product){
    return /*html*/ `
        <article class="cart__item" data-id="${product._id}" data-color="${product.color}">
            <div class="cart__item__img">
                <img src="${product.imageUrl}" alt="${product.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${product.color}</p>
                <p>${product.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}" onchange="updateQuantity('${product._id}', '${product.color}', this.value)">
                </div>
                <div class="cart__item__content__settings__delete" onclick="deleteProduct('${product._id}', '${product.color}')">
                    <p class="deleteItem">Supprimer</p>
                </div>
                </div>
            </div>
            </article>
    `;
}

//supprime le produit au click
document.querySelectorAll(".deleteItem").forEach(item => item.addEventListener("click", (e) => {
    let deleteItem = e.target.closest('[data-id]');
    let product = deleteItem.dataset;
    removeProduct(product);
    window.location.assign("cart.html");
}));

// eslint-disable-next-line no-unused-vars
function deleteProduct(id, color){
    removeProduct(id, color);
    showPage();
}

// eslint-disable-next-line no-unused-vars
function updateQuantity(id, color, qty){
    //datamanager
    showPage();
}

/*

//sauvegarde le panier
function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
}

//recupere le panier selected
function getBasket() {
    let basket = localStorage.getItem("basket");
    if(basket == null) {
        return [];
    }else{
        return JSON.parse(basket);
    }
}

//ajoute un produit au panier
function addBasket(product) {
    let basket = getBasket();
    let foundProduct = basket.find(p => p.id == product.id);
    if (foundProduct != undefined) {
        foundProduct.quantity++;
    }else{
        product.quantity = 1;
        basket.push(product);
    }
    saveBasket(basket);
}

//supprime un produit du panier
function removeFromBasket(product) {
    let basket = getBasket();
    basket = basket.filter(p => p.id != product.id);
    saveBasket(basket);
}

//change la quantity selected
function changeQuantity(product, quantity) {
    let basket = getBasket();
    let foundProduct = basket.find(p => p.id == product.id);
    if (foundProduct != undefined) {
        foundProduct.quantity += quantity;
        if (foundProduct.quantity <= 0) {
            removeFromBasket(product);
        } else {
            saveBasket(basket);
        }
    }
}

//recupere le nombre de produit
function getNumberProduct() {
    let basket = getBasket();
    let number = 0;
    for(let product of basket){
        number += product.quantity;
    }
    return number;
}

//recupere le prix total
function getTotalPrice() {
    let basket = getBasket();
    let total = 0;
    for(let product of basket){
        total += product.quantity * product.price;
    }
    return total;
}


//2e solution pour une meilleur performance

class Basket {
    constructor() {
        let basket = localStorage.getItem("basket");
        if (basket == null) {
            this.basket = JSON.parse(basket);
        }
    }

    save() {
        localStorage.setItem("basket", JSON.stringify(this.basket));
    }

    //ajoute un produit au panier
    add(product) {
        let foundProduct = this.basket.find(p => p.id == product.id);
        if (foundProduct != undefined) {
            foundProduct.quantity++;
        }else{
            product.quantity = 1;
            this.basket.push(product);
        }
        this.save();
    }

    //supprime un produit du panier
    remove(product) {
        this.basket = this.basket.filter(p => p.id != product.id);
        this.save();
    }

    //change la quantity selected
    changeQuantity(product, quantity) {
        let foundProduct = this.basket.find(p => p.id == product.id);
        if (foundProduct != undefined) {
            foundProduct.quantity += quantity;
            if (foundProduct.quantity <= 0) {
                this.remove(product);
            } else {
                this.save();
            }
        }
    }

    //recupere le nombre de produit
    getNumberProduct() {
        let number = 0;
        for(let product of this.basket){
            number += product.quantity;
        }
        return number;
    }

    //recupere le prix total
    getTotalPrice() {
        let total = 0;
        for(let product of this.basket){
            total += product.quantity * product.price;
        }
        return total;
    }
}

*/