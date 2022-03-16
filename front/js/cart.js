import {getCartContent, getProduct, changeQty, removeProduct, sendCommand} from "./datamanager.js";

exposeToWindow("updateQuantity", updateQuantity);
exposeToWindow("deleteProduct", deleteProduct);

const validator  = {
    firstName : {
        msg : "Veuillez entrer votre prénom",
        regex : /^[a-zé]{2,}$/gi
    },
    lastName : {
        msg : "Veuillez entrer votre nom",
        regex : /^[a-zé]{2,}$/gi
    },
    city : {
        msg : "Veuillez entrer votre ville",
        regex : /^[a-zé]{2,}$/gi
    },
    email : {
        msg : "Veuillez entrer votre adresse email",
        regex : /^[a-zé0-9]+@{1,}[a-z0-9]{2,}\.[a-z]{2,4}$/gi
    },
    address : {
        msg : "Veuillez entrer votre adresse",
        regex : /^[0-9]{1,}[a-z0-9]{3,}$/gi
    }
};
// console.log(validator);

async function showPage(){
    const cart = getCartContent();
    let product;
    let html = "";
    let total = 0;
    let articles = 0;
    for (const [idProduct, colors] of Object.entries(cart)){
        for (let [color, qty] of Object.entries(colors)){
            qty = parseInt(qty);
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

function exposeToWindow(key, value){
    window[key] = value;
}

// eslint-disable-next-line no-unused-vars
function deleteProduct(id, color){
    removeProduct(id, color);
    showPage();
}

// eslint-disable-next-line no-unused-vars
function updateQuantity(id, color, qty){
    changeQty(id, color, qty);
    showPage();
}


//creation de l'objet contact
//const checkForm = document.querySelector("cart__order__form");

/*
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


    saveForm(contact);
});
*/



document.querySelectorAll("input").forEach(input =>{
    if (input.id === "order") {
        input.onclick = validFields;
        return;
    }
    if (!validator[input.id]) {
        console.log("le champs", input.id,"n'est pas pris en charge");
        return;
    }
    input.valid = function (){
        const isValid = validator[input.id].regex.test(input.value);
        document.getElementById(input.id+"ErrorMsg").innerText = isValid ? "" :validator[input.id].msg;
        return isValid;
    },
    input.oninput = input.valid;


});


/**
 * calcule le nombre d'erreur pour le formulaire de commande 
 *
 * @return  {[Object]}
 */
function validFields(){
    let totalInput = 0, errorsInput=0;
    const contact = {};
    document.querySelectorAll("input").forEach(input =>{
        if (!validator[input.id]) return;
        totalInput++;
        errorsInput += input.valid() ? 0 : 1;
        contact[input.id] = input.value;
    });
    sendCommand(contact);
    if (totalInput > 0 && errorsInput > 0) return;
}