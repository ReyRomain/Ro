/**
 * @typedef {Object} productData
 * @property {String} altTxt        le texte alternatif d'une image  exemple "Photo d'un canapé bleu, deux places"
 * @property {Array} colors         un tableau de couleurs  exemple (3) ['Blue', 'White', 'Black']
 * @property {String} description   la description du produit   exemple "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
 * @property {String} imageUrl      l'image du produit exemple "http://localhost:3000/images/kanap01.jpeg"
 * @property {String} name          le nom du produit exemple "Kanap Sinopé"
 * @property {Number} price         le prix  exemple 1849
 * @property {String} _id           la référence du produit exemple "107fb5b75607497b96722bda5b504926"
 */


const source = "http://localhost:3000/api/products";

/**
 * va chercher la lise des produits sur l'api
 *
 * @return  {Promise.<Array.<productData>>}  [return description]
 */
async function getProductList(){
    const response = await fetch(source);
    return await response.json();
}


export {
    getProductList
};