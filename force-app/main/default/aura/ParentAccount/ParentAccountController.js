({
    handleFilterChange: function(component, event) {
        var filters = event.getParam('selectedOption');
        console.log('filters=' + filters);
        component.set('v.message', filters.length > 0 ? 
                      'Selected ContactId from Child LWC: ' + filters : 
                      'No selection from Child LWC');
    },
});