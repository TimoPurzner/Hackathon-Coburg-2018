


/**
 * Returns a URL for queryParams to share or save the query
 * @param spreadParam: queryParams
 * @return string: URL
 *
 * TODO: decide if we actually want to keep this shit
 */
export function getProductQueryString (... queryParams) {
    return "there is nothing here yet";
}

/**
 * Returns an object with filter options for search query (query string example: "iphone")
 * @param string: query
 * @return Object: filterOptions
 *
 */
export function getFilterOptions (query) {
    return {};
}

/**
 * Returns URL of product image by id
 * @param string: imageId
 * @return string: URL
 *
 */
export function getProductImageURL (imageId) {
    return "there is nothing here yet";
}

/**
 * Returns URL of product by search masterSku (article number) and sku (second article number)
 * @param string: masterSku
 * @param string: sku
 * @return string: URL
 *
 */
export function getProductURL (masterSku, sku) {
    return "there is nothing here yet";
}

/**
 * Returns URL of top product by search query (query string example: "iphone")
 * @param spreadParam: queryParams
 * @return Object: {productName, productImageURL, productURL, productDescription}
 *
 */
export function getTopProduct (... queryParams) {
    return {};
}