/**
 * @typedef  {Object} productData
 * @property {String} altTxt        le texte alternatif d'une image  exemple "Photo d'un canapé bleu, deux places"
 * @property {Array} colors         un tableau de couleurs  exemple (3) ['Blue', 'White', 'Black']
 * @property {String} description   la description du produit   exemple "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
 * @property {String} imageUrl      l'image du produit exemple "http://localhost:3000/images/kanap01.jpeg"
 * @property {String} name          le nom du produit exemple "Kanap Sinopé"
 * @property {Number} price         le prix  exemple 1849
 * @property {String} _id           la référence du produit exemple "107fb5b75607497b96722bda5b504926"
 */

/***
 * la source des données (url)
 * @type {String}
 */
const source = "http://localhost:3000/api/products";

/**
 * contient les données déjà chargées
 *
 * @var {Object.<productData>}
 */
const data = {};

/**
 * la représentation sous forme d'objet du localStorage
 *
 * @var {Object}
 */
const storage = !localStorage.cart ? {} : JSON.parse(localStorage.cart);

/**
 * va chercher la liste des produits sur l'api
 *
 * @return  {Promise.<Array.<productData>>}  [return description]
 */
async function getProductList(){
    const response = await fetch(source);
    return await response.json();
}

/**
 * va chercher les informations d'un produit sur l'api
 * @param {String}  id la référence du produit
 *
 * @return  {Promise.<productData>}  [return description]
 */
async function getProduct(id){
    if (data[id]) return data[id];
    const response = await fetch(source+"/"+id);
    return await response.json();
}

/**
 * ajoute un produit au panier
 *
 * @param   {String}  productId  [productId description]
 * @param   {String}  color      [color description]
 * @param   {Number}  qty        [qty description]
 *
 * @return  {void}               complète storage et lo olcalStorage
 */
function addToCart(productId, color, qty){
    if (!storage[productId]) storage[productId] = {};
    if (!storage[productId][color]) storage[productId][color] = 0;
    storage[productId][color] +=qty;
    localStorage.setItem("cart", JSON.stringify(storage));
}

export {
    addToCart,
    getProduct,
    getProductList
};