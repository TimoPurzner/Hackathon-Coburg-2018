let utils = require('./utils.js');

let request = require('request');


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
                    uri: utils.searchBaseURL,
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
                    uri: utils.searchBaseURL,
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
 * Returns URL of top product by query object
 * @param Object: queryObject (Object with mandatory query and filters key)
 * @return Object: {name, imageURL, url, description, brand, price}
 *
 */
function getTopProduct (queryObject) {

    let productInformation = {
        name: '',
        imageURL: '',
        url: '',
        description: '',
        brand: '',
        price: ''
    };

    return new Promise(
        function (resolve, reject) {
            request(
                {
                    method: 'POST',
                    uri: utils.searchBaseURL,
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
                        'query': queryObject.query,
                        'filters': queryObject.filters
                    }
                },
                function (error, response, body) {
                    if(response.statusCode === 200){
                        let info = response.body.searchresult.result.styles[0];

                        productInformation = {
                            name: info.name,
                            imageURL: utils.getProductImageURL(info.images),
                            url: utils.getProductURL(info.masterSku, info.sku),
                            description: info.description.replace(/<[^>]+>/g, ' '),
                            brand: info.brand,
                            price: utils.getFormattedPrice(info.price.value, info.price.currency)
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
