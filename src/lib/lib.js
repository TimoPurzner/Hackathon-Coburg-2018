var request = require('request');


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
 * Returns URL of product image by id
 * @param string: imageId
 * @return string: URL
 *
 */
function getProductImageURL (imageId) {
    return 'https://media.baur.de/i/empiriecom/' + imageId;
}

/**
 * Returns URL of product by search masterSku (article number) and sku (second article number)
 * @param string: masterSku
 * @param string: sku
 * @return string: URL
 *
 */
function getProductURL (masterSku, sku) {
    return 'https://www.baur.de/p/' + masterSku + '#sku=' + sku;
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
                    uri: 'https://www.baur.de/suche/serp/magellan',
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
                        let info = response.body.searchresult.result.styles[0];

                        productInformation = {
                            name: info.nameNoBrand,
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
