let customlib = require('./empiriecom/api.js');

customlib.getTopProduct({query: "iphone", filters: { }}).then(bla => {
    console.log(bla);
});

customlib.getFilters('iphone x').then(bla => {
    console.log(bla);
});

customlib.getFilterOptions('iphone x', 's_filter_Availability').then(bla => {
    console.log(bla);
});   

