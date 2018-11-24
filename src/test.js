let api = require('./empiriecom/api.js');

let utils = require('./empiriecom/utils.js');

api.getTopProduct({query: "iphone", filters: { }}).then(bla => {
    console.log(bla);
});


utils.mapFilterToCode('Farbe', 'cognac')
    .then(p => console.log(p))
    .catch(e => console.log(e.error));

//console.log(filterObject);

customlib.getFilters('iphone x').then(bla => {
    console.log(bla);
});

customlib.getFilterOptions('iphone x', 's_filter_Availability').then(bla => {
    console.log(bla);
});

