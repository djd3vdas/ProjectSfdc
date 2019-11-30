({
	doInit : function(component, event, helper) {
		helper.getAllContactsRecord(component);
        
	},
    doRedirect : function(component, event, helper) {
        var eventSource = event.getSource();       
        var id= eventSource.get('v.name');
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
          "recordId": id,
          "slideDevName": "detail"
        });
        navEvt.fire();
}
    
})