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
 * @return Object: filterOptions
 *
 */
function getFilterOptions (query) {
    return {};
}

/**
 * Returns URL of top product by search query (query string example: 'iphone')
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
