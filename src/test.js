let customlib = require('./empiriecom/api.js');

customlib.getTopProduct({query: "iphone", filters: { filter_color: ['f135'] } }).then(bla => {
    console.log(bla);
});
