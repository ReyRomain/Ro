import {getCartContent, getProduct, getProductList, removeProduct} from "./datamanager.js";

const cart = getCartContent();
console.log(cart);

const validator  = {
    firstName : {
        msg : "Veuillez entrer votre prénom",
        regex : /[a-z]{3,}/gi
    },
    lastName : {
        msg : "Veuillez entrer votre nom",
        regex : /[a-z]{3,}/gi
    },
    city : {
        msg : "Veuillez entrer votre ville",
        regex : /[a-z]{3,}/gi
    },
    email : {
        msg : "Veuillez entrer votre adresse email",
        regex : /[a-z]{3,}/gi
    },
    address : {
        msg : "Veuillez entrer votre adresse",
        regex : /[a-z]{3,}/gi
    }
};

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
    document.getElementById("totalPrice").innerText = total.toString();
    document.getElementById("totalQuantity").innerText = articles.toString();
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

/*
//supprime le produit au click
document.querySelectorAll(".deleteItem").forEach(item => item.addEventListener("click", (e) => {
    let deleteItem = e.target.closest('cart_item');
    let product = deleteItem.dataset;
    removeProduct(product);
    window.location.assign("cart.html");
}));
*/

// eslint-disable-next-line no-unused-vars
function deleteProduct(id, color){
    removeProduct(id, color);
    showPage();
}

// eslint-disable-next-line no-unused-vars
function updateQuantity(id, color, qty){
    getProductList();
    //datamanager
    showPage();
}



//creation de l'objet contact
let checkForm = document.querySelector("cart__order__form");

checkForm.addEventListener("submit", function(event) {
    event.preventDefault();
    if(getCartContent().keys.length === 0){
        alert("Votre panier est vide, veuillez selectionner un produit");
        return;
    }

    const firstName = inputValue("firstName");
    const lastName = inputValue("lastName");
    const address = inputValue("address");
    const city = inputValue("city");
    const email = inputValue("email");

    
    //l'objet contact
    const contact = {
        firstName,
        lastName,
        address,
        city,
        email
    };
    

    //si le champs est validé regarder celui d'après sinon message d'erreur
    validInput(firstName, "firstName");
    validInput(lastName, "lastName");
    validInput(city, "city");
    validInput(email, "email");
    validInput(address, "address");


    // saveForm(contact);
});

/*
//function qui envoie l'objet contact dans le localStorage
function saveForm(contact){
    localStorage.setItem("contact", JSON.stringify(contact));
}
*/

//vérification de checkForm
checkForm/*.firstName*/.addEventListener("change", function(){
    validInput(this.value, "firstName");
});

checkForm/*.lastName*/.addEventListener("change", function(){
    validInput(this.value, "lastName");
});

checkForm/*.city*/.addEventListener("change", function(){
    validInput(this.value, "city");
});

checkForm/*.address*/.addEventListener("change", function(){
    validInput(this.value, "address");
});

checkForm/*.email*/.addEventListener("change", function(){
    validInput(this.value, "email");
});

checkForm();

/**
 * [validInput description]
 *
 * @param   {String}  value  [value description]
 * @param   {("firstName" | "lastName" | "address" | "city" | "email")}  type   [type description]
 *
 * @return  {void}         [return description]
 */
function validInput(value, type){
    const { regex, msg} = validator[type];
    const isValid = regex.test(value);
    document.getElementById(type+"ErrorMsg").innerText = isValid ? "" : msg;
}

function inputValue(id){
    /**
     * l'inout dans le DOM
     *
     * @type {HTMLInputElement}
     */
    const DOMtarget = document.querySelector("#"+id);
    return DOMtarget.value;
}

function lastName(lastName) {
    throw new Error("Function not implemented.");
}