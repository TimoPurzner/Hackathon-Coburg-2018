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
 * function to map a filter name (e.g. "Farbe") and its value to a filter key and its code
 * @param filterName
 * @param filterValue
 * @returns {Promise<any>}
 */
function mapFilterToCode (filterName, filterValue) {

    let stream = fs.createReadStream('src/empiriecom/filter-mapping.csv');
    let filterObject = {};
    let filterArray = [];

    return new Promise(
        function (resolve, reject) {
            csv
                .fromStream(stream, {delimiter: ';', headers: true})
                .on('data', (data) => {
                    let rowData = {};

                    Object.keys(data).forEach(current_key => {
                        rowData[current_key] = data[current_key]
                    });

                    if(rowData.filterValue === filterValue && rowData.filterName === filterName) {

                        filterObject = {
                            filterKey: rowData.filterKey,
                            filterCode: rowData.filterCode
                        };
                        filterArray.push(filterObject)
                    }

                }).on('end', () => {
                if(filterArray != undefined && filterArray.length != 0) {
                    resolve(filterArray);
                }
                else {
                    reject({error: 'could not retrieve filter'});
                }
            });
        });

}

/**
 * function to build filter object
 * @param filterArray
 * @returns {Promise<any>}
 */
function buildFilterObject (filterArray) {
    let filters = {};

    return new Promise(
        function (resolve, reject) {
            for (let i in filterArray) {
                const keyName = Object.keys(filterArray[i]);
                if (filters.hasOwnProperty(keyName[0])) {
                    const tmp = filterArray[i];
                    filters[keyName].push(tmp[keyName]);
                } else {
                    const tmp = filterArray[i];
                    let tmpArr = [];
                    tmpArr.push(tmp[keyName]);
                    filters[keyName] = tmpArr;

                }
            }

            if (filters != undefined)
                resolve(filters);
            else
                reject({error: 'could not build filter object'});
        });
}

module.exports = {
    getFormattedPrice: getFormattedPrice,
    getProductImageURL: getProductImageURL,
    getProductURL: getProductURL,
    mapFilterToCode: mapFilterToCode,
    buildFilterObject: buildFilterObject,
    searchBaseURL: searchBaseURL
};