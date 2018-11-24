let api = require('./empiriecom/api.js');

let utils = require('./empiriecom/utils.js');

api.getTopProduct({query: "iphone", filters: { }}).then(bla => {
    console.log(bla);
});


utils.mapFilterToCode('Farbe', 'schwarz')
    .then(p => console.log(p))
    .catch(e => console.log(e.error));

//console.log(filterObject);

api.getFilters('iphone x').then(bla => {
    console.log(bla);
});

api.getFilterOptions('iphone x', 's_filter_Availability').then(bla => {
    console.log(bla);
});

utils.buildFilterObject([{filter_color: 'f1234'}, {filter_color: 'f345'}, {filter_size: 'f38'}])
    .then(p => console.log(p))
    .catch(e => console.log(e.error));;

