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
    //datamanager
    showPage();
}

//creation de l'objet contact
let checkForm = document.querySelector("cart__order__form");

checkForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const email = document.getElementById("email");

    //l'objet contact
    const contact = {
        firstName = firstName,
        lastName = lastName,
        address = address,
        city = city,
        email = email
    }

    //si le champs est validé regarder celui d'après sinon message d'erreur
    if(firstNameIsValid(checkForm.firstName) == false){
        alert("Veuillez entrer votre prénom");

    }else if(lastNameIsValid(checkForm.lastName) == false){
        alert("Veuillez entrer votre nom");

    }else if(cityIsValid(checkForm.city) == false){
        alert("Veuillez entrer votre ville");

    }else if(mailIsValid(checkForm.email) == false){
        alert("Veuillez entrer votre adresse email");

    }else if(getCartContent.length == 0){
        alert("Votre panier est vide, veuillez selectionner un produit");

    }else{
        saveForm(contact);
    }
});

//function qui envoie l'objet contact dans le localStorage
function saveForm(contact){
    localStorage.setItem("contact", JSON.stringify(contact));
}

//vérification de checkForm
checkForm.firstName.addEventListener('change', function(){
    firstNameIsValid(this);
});

checkForm.lastName.addEventListener('change', function(){
    lastNameIsValid(this);
});

checkForm.city.addEventListener('change', function(){
    cityIsValid(this);
});

checkForm.email.addEventListener('change', function(){
    mailIsValid(this);
});