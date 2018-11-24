let request = require('request');

const productBaseURL = 'https://www.baur.de/p/';
const imageBaseURL = 'https://media.baur.de/i/empiriecom/';
const searchBaseURL = 'https://www.baur.de/suche/serp/magellan';

/**
 * Returns a URL for queryParams to share or save the query
 * @param spreadParam: queryParams
 * @return string: URL
 *
 * TODO: decide if we actually want to keep this shit
 */
function getProductQueryString (... queryParams) {
    return 'there is nothing here yet';
}

/**
 * Returns an object with filter options for search query (query string example: 'iphone')
 * @param string: query
 * @return Object: filters
 *
 */
function getFilters (query) {
    let filters = {
    };

    return new Promise(
        function (resolve, reject) {
            request(
                {
                    method: 'POST',
                    uri: searchBaseURL,
                    json: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': '*/*',
                        'user-agent':'*'
                    },
                    body: {
                        'start': 0,
                        'clientId': 'BaurDe',
                        'version': 42,
                        'channel': 'web',
                        'locale': 'de_DE',
                        'count': 1,
                        'query': query
                    }
                },
                function (error, response, body) {
                    if(response.statusCode === 200){
                        var data = response.body.searchresult.result.filters;
                        for (var i = 0; i < data.length; i++) {
                            filters[data[i].id] = data[i].displayName;
                        }
                        resolve(filters);
                    } else {
                        reject({error: 'could not retrieve top product'});
                        console.log('error: '+ response.statusCode);
                    }
                }
            );
        });
}

/**
 * Returns an object with filter options for search query (query string example: 'iphone')
 * @param string: query
 * @param string: option
 * @return Object: filterOptions
 *
 */
function getFilterOptions (query, option) {
    let filterOptions = {
    };

    return new Promise(
        function (resolve, reject) {
            request(
                {
                    method: 'POST',
                    uri: searchBaseURL,
                    json: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': '*/*',
                        'user-agent':'*'
                    },
                    body: {
                        'start': 0,
                        'clientId': 'BaurDe',
                        'version': 42,
                        'channel': 'web',
                        'locale': 'de_DE',
                        'count': 1,
                        'query': query
                    }
                },
                function (error, response, body) {
                    if(response.statusCode === 200){
                        var data = response.body.searchresult.result.filters;
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].id == option) {
                                for (var index = 0; index < 3; index++) {
                                    filterOptions[data[i].values[index].valueId] = data[i].values[index].valueDisplayName;        
                                }
                            } 
                        }
                        resolve(filterOptions);
                    } else {
                        reject({error: 'could not retrieve top product'});
                        console.log('error: '+ response.statusCode);
                    }
                }
            );
        });
}

/**
 * Returns URL of product image by id
 * @param string: imageId
 * @return string: URL
 *
 */
function getProductImageURL (imageId) {
    return imageBaseURL + imageId;
}

/**
 * Returns URL of product by search masterSku (article number) and sku (second article number)
 * @param string: masterSku
 * @param string: sku
 * @return string: URL
 *
 */
function getProductURL (masterSku, sku) {
    return productBaseURL + masterSku + '#sku=' + sku;
}

/**
 * Returns URL of top product by search query (query string example: 'iphone')
 * @param string: query
 * @return Object: {name, imageURL, url, description, brand}
 *
 */
function getTopProduct (query) {
    let productInformation = {
        name: '',
        imageURL: '',
        url: '',
        description: '',
        brand: ''
    };

    return new Promise(
        function (resolve, reject) {
            request(
                {
                    method: 'POST',
                    uri: searchBaseURL,
                    json: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': '*/*',
                        'user-agent':'*'
                    },
                    body: {
                        'start': 0,
                        'clientId': 'BaurDe',
                        'version': 42,
                        'channel': 'web',
                        'locale': 'de_DE',
                        'count': 1,
                        //'order': 'price-desc',
                        'brand': 'APPLE',
                        'query': query
                    }
                },
                function (error, response, body) {
                    if(response.statusCode === 200){
                        let info = response.body.searchresult.result.styles[0];

                        productInformation = {
                            name: info.name,
                            imageURL: getProductImageURL(info.images),
                            url: getProductURL(info.masterSku, info.sku),
                            description: info.description.replace(/<[^>]+>/g, ' '),
                            brand: info.brand
                        };

                        resolve(productInformation);
                    } else {
                        reject({error: 'could not retrieve top product'});
                        console.log('error: '+ response.statusCode);
                    }
                }
            );
        });

}

module.exports.getTopProduct = getTopProduct;
module.exports.getFilters = getFilters;
module.exports.getFilterOptions = getFilterOptions;
