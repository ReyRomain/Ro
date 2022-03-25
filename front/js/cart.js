import {getCartContent, getProduct, changeQty, removeProduct, sendCommand} from "./datamanager.js";

exposeToWindow("updateQuantity", updateQuantity);
exposeToWindow("deleteProduct", deleteProduct);

/**
 * l'objet validator avec ses RegExp
 *
 * @var {Object}
 */
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
        regex : /^[a-z0-9.]+@{1,}[a-z0-9]{2,}\.[a-z]{2,4}$/gi
    },
    address : {
        msg : "Veuillez entrer votre adresse",
        regex : /^[0-9]{1,}[a-z0-9 ]{3,}$/gi
    }
};

/**
 * affiche les produits du storage selectionné et les quantités selectionné
 *
 * @return  {Promise.<void>}
 */
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

/**
 * le gabarit d'un produit dans le panier
 *
 * @param   {Object}  product           les informations du produit
 * @param   {String}  product._id       l'id du produit
 * @param   {Number}  product.price     le prix
 * @param   {Number}  product.qty       la quantité
 * @param   {String}  product.altTxt    le texte alternatif
 * @param   {String}  product.color     la variante couleur
 * @param   {String}  product.imageUrl  l'url de l'image à afficher
 * @param   {String}  product.name      le nom du produit
 *
 * @return  {String}                    le html à injecter dans la page
 */
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

/**
 * expose un élément dans le DOM (puisqu'innaccessible ici à cause du type module)
 *
 * @param   {String}  key     le nom auquel il sera accessible depuis le DOM
 * @param   {*}       value   l'élément à associer
 *
 * @return  {void}
 */
function exposeToWindow(key, value){
    window[key] = value;
}

/**
 * au clic supprime un produit du panier
 * 
 * @param {String}    id      l'id à supprimer
 * @param {String}    color   la variante couleur à supprimer
 * 
 * @return {void}             rafraichi l'affichage
 */
// eslint-disable-next-line no-unused-vars
function deleteProduct(id, color){
    removeProduct(id, color);
    showPage();
}

/**
 * à la modification de l'input change la quantité d'un produit du panier
 * 
 * @param {String}    id      l'id à supprimer
 * @param {String}    color   la variante couleur
 * @param {Number}    qty     la nouvelle quantité
 * 
 * @return {void}             rafraichi l'affichage
 */
// eslint-disable-next-line no-unused-vars
function updateQuantity(id, color, qty){
    changeQty(id, color, qty);
    showPage();
}

//vérifie si les inputs sont validés par les RegExp
document.querySelectorAll("input").forEach(input =>{
    if (input.id === "order") {
        input.addEventListener("click", validFields);
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
 * calcule le nombre d'erreur pour le formulaire de contact 
 *
 * @param   {Event}  event
 * 
 * @return  {void}   appelle sendCommand si il n'y a pas d'erreurs
 */
function validFields(event){
    event.stopPropagation();
    event.preventDefault();
    let totalInput = 0, errorsInput=0;
    const contact = {};
    document.querySelectorAll("input").forEach(input =>{
        if (!validator[input.id]) return;
        // console.log(input, validator[input.id],input.valid());
        totalInput++;
        errorsInput += input.valid() ? 0 : 1;
        contact[input.id] = input.value;
    });
    if (totalInput > 0 && errorsInput > 0) return;
    sendCommand(contact);
}