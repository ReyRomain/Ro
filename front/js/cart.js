/*import {addToCart} from "./datamanager.js";*/

/*
//récupération des produits dans le localStorage
function getCart() {
    let cart = localStorage.getItem("addToCart");
}
*/



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