let csv = require('fast-csv');
let fs = require('fs');

/**
 * base urls
 */
const productBaseURL = 'https://www.baur.de/p/';
const imageBaseURL = 'https://media.baur.de/i/empiriecom/';
const searchBaseURL = 'https://www.baur.de/suche/serp/magellan';

/**
 * function to format price
 * @param price
 * @param currency
 * @returns {string}
 */
function getFormattedPrice (price, currency) {
    let tmpPrice = '' + parseFloat(Math.round(price * 100) / 100).toFixed(2);

    return tmpPrice.replace('.', ',') + ' ' + currency;
}

/**
 * function to concat image id with base url
 * @param imageId
 * @returns {string}
 */
function getProductImageURL (imageId) {
    return imageBaseURL + imageId;
}

/**
 * function to concat product ids with base url
 * @param masterSku
 * @param sku
 * @returns {string}
 */
function getProductURL (masterSku, sku) {
    return productBaseURL + masterSku + '#sku=' + sku;
}

/**
 * function to map a filter_key (e.g. "Farbe") and its value to a filter key and its code
 * @param filterKey
 * @param filterValue
 * @returns {Promise<any>}
 */
function mapFilterToCode (filterKey, filterValue) {

    let stream = fs.createReadStream('src/empiriecom/filter-mapping.csv');
    let filterObject = {};

    return new Promise(
        function (resolve, reject) {
            csv
                .fromStream(stream, {delimiter: ';', headers: true})
                .on('data', (data) => {
                    let rowData = {};

                    Object.keys(data).forEach(current_key => {
                        rowData[current_key] = data[current_key]
                    });

                    if(rowData.filterValue === filterValue && rowData.filterKey === filterKey) {

                        filterObject = {
                            filterKey: rowData.filterKey,
                            filterCode: rowData.filterCode
                        };
                    }

                }).on('end', () => {
                if(filterObject.filterKey != undefined) {
                    resolve(filterObject);
                }
                else {
                    reject({error: 'could not retrieve top product'});
                }
            });
        });

}

function buildQueryObject (queryString, ) {

}

module.exports = {
    getFormattedPrice: getFormattedPrice,
    getProductImageURL: getProductImageURL,
    getProductURL: getProductURL,
    mapFilterToCode: mapFilterToCode,
    searchBaseURL: searchBaseURL
};