/**
 * @typedef {import("./datamanager.js").productData} productData
 */

import {getProductList} from "./datamanager.js";

/**
 * template d'un produit afin de pouvoir utiliser innerHTLM dans le cadre d'un templating conformément à la trame d'évaluation
 *
 * @param   {productData}  productSpecs  les caractéristiques d'un produit
 *
 * @return  {String}                     le bloc html d'un produit
 */
function templateProduit(productSpecs){
    return `
    <a href="./product.html?id=${productSpecs._id}">
        <article>
        <img src="${productSpecs.imageUrl}" alt="Lorem ipsum dolor sit amet, Kanap name1">
        <h3 class="productName">${productSpecs.name}</h3>
        <p class="productDescription">${productSpecs.description}</p>
        </article>
    </a>
    `;
}

/**
 * rempli le contenu de la page d'accueil
 *
 * @return  {void}  injecte les produits dans le DOM
 */
async function showPage(){
    const produits = await getProductList();
    console.log(produits);
    let html = "";
    produits.forEach(produit => {
        html += templateProduit(produit);
    }); 
    document.getElementById("items").innerHTML = html;
}

showPage();