let customlib = require('./empiriecom/api.js');

customlib.getTopProduct({query: "iphone", filters: { }}).then(bla => {
    console.log(bla);
});
