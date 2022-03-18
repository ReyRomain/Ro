import {addToCart, getProduct} from "./datamanager.js";

let id;

/**
 * retourne l'id du produit selectionner pour l'afficher sur la page produit 
 *
 * @return  {Promise}
 */
async function showProduct() {
    id = window.location.href.split("?id=")[1];
    const productSpecs = await getProduct(id);

    //changer le titre de la page
    document.title = productSpecs.name;

    //insérer l'image dans class="item__img"
    const image  = document.createElement("img");
    image.src = productSpecs.imageUrl;
    image.alt = "photographie du canapé "+productSpecs.name;
    document.querySelector(".item__img").appendChild(image);

    //affichage du nom du produit
    document.getElementById("title").innerText = productSpecs.name;

    //affichage du prix du produit
    document.getElementById("price").innerText = productSpecs.price.toString();

    //affichage de la description du produit
    document.getElementById("description").innerText = productSpecs.description;

    //sélection de la couleur
    let colorsOptions = "";
    for (const productSelectColor of productSpecs.colors) {
        colorsOptions += `<option value="${productSelectColor}">${productSelectColor}</option>`;
    }
    document.querySelector("#colors").innerHTML = colorsOptions;
}

document.getElementById("addToCart").onclick = function (){
    /**
     * @type   {HTMLInputElement}  document
     */
    const DOMqty = document.querySelector("#quantity");
    const qty = parseInt(DOMqty.value);
    if (qty <1 || qty > 100) return;
    /**
     * @type   {HTMLInputElement}  colors
     */
    const colors = document.querySelector("#colors");
    addToCart(
        id,
        colors.value,
        qty
    );
};

showProduct();