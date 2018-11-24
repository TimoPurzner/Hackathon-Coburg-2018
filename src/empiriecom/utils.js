/**
 * base urls
 */
const productBaseURL = 'https://www.baur.de/p/';
const imageBaseURL = 'https://media.baur.de/i/empiriecom/';
const searchBaseURL = 'https://www.baur.de/suche/serp/magellan';

/**
 * Helper function to format price
 * @param price
 * @param currency
 * @returns {string}
 */
function getFormattedPrice (price, currency) {
    let tmpPrice = '' + parseFloat(Math.round(price * 100) / 100).toFixed(2);

    return tmpPrice.replace('.', ',') + ' ' + currency;
}

/**
 * Helper function to concat image id with base url
 * @param imageId
 * @returns {string}
 */
function getProductImageURL (imageId) {
    return imageBaseURL + imageId;
}

/**
 * Helper function to concat product ids with base url
 * @param masterSku
 * @param sku
 * @returns {string}
 */
function getProductURL (masterSku, sku) {
    return productBaseURL + masterSku + '#sku=' + sku;
}

module.exports = {
    getFormattedPrice: getFormattedPrice,
    getProductImageURL: getProductImageURL,
    getProductURL: getProductURL,
    searchBaseURL: searchBaseURL
};