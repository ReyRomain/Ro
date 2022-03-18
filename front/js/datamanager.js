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
let storage = !localStorage.cart ? {} : JSON.parse(localStorage.cart);

/**
 * va chercher la liste des produits sur l'api
 *
 * @return  {Promise.<Array.<productData>>}
 */
async function getProductList() {
    const response = await fetch(source);
    return await response.json();
}

/**
 * va chercher les informations d'un produit sur l'api
 * @param {String}  id la référence du produit
 *
 * @return  {Promise.<productData>}
 */
async function getProduct(id) {
    if (data[id]) return data[id];
    const response = await fetch(source + "/" + id);
    return await response.json();
}

/**
 * ajoute un produit au panier
 *
 * @param   {String}  productId  l'id d'un produit de l'API
 * @param   {String}  color      la couleur de l'id
 * @param   {Number}  qty        la quantité à ajouter
 *
 * @return  {void}               complète storage et le localStorage
 */
function addToCart(productId, color, qty) {
    if (!storage[productId]) storage[productId] = {};
    if (!storage[productId][color]) storage[productId][color] = 0;
    storage[productId][color] += qty;
    saveStorage();
}

/**
 * change la quantité des produits au panier
 *
 * @param   {String}  productId  l'id d'un produit de l'API
 * @param   {String}  color      la couleur de l'id
 * @param   {Number}  newQty     la nouvelle quantité à modifier
 *
 * @return  {void}               actualise le localStorage
 */
function changeQty(productId, color, newQty) {
    storage[productId][color] = newQty;
    saveStorage();
}

/**
 * retourne le storage
 *
 * @return  {Object}
 */
function getCartContent() {
    return storage;
}

/**
 * retire l'id et la couleur du produit du panier
 *
 * @param   {String}  id     id du produit
 * @param   {String}  color  nom de la couleur
 *
 * @return  {void}
 */
function removeProduct(id, color) {
    delete storage[id][color];
    saveStorage();
}

/**
 * sauvegarde le panier dans le localStorage
 *
 * @return  {void}
 */
function saveStorage() {
    localStorage.setItem("cart", JSON.stringify(storage));
}

/**
 * effectue une requête POST sur l'API
 *
 * @param   {Object}  contact  l'objet contact qui contient le formulaire valide
 *
 * @return  {Promise.<void>}
 */
async function sendCommand(contact) {
    const response = await fetch(source + "/order", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ contact, products : Object.keys(storage) })
    });
    const data = await response.json();
    // console.log(data);
    storage = {};
    saveStorage();
    window.location.href="./confirmation.html?"+data.orderId;
}

export {
    addToCart,
    changeQty,
    getCartContent,
    getProduct,
    getProductList,
    removeProduct,
    sendCommand
};