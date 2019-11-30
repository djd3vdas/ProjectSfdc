({
	saveRecordCntrlr : function(component, event, helper) {
        component.find("recordHandler").saveRecord($A.getCallback(function(saveResult) { 
        	
            if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                       var toastEvent = $A.get("e.force:showToast");        
                    toastEvent.setParams({
                        "title" : 'Success Message',
                        "message": 'Saved Successfully',
                       // "messageTemplate": 'Record {0} Saved! See it {1}!',
                        "duration":' 5000',
                        "key": 'info_alt',
                        "type": 'success',
                       "mode": 'pester'
                });
       		 toastEvent.fire();
            	console.log('recordSaved');
            	component.set("v.curView", "baseView" );            
            } else if (saveResult.state === "INCOMPLETE") {
                console.log("User is offline, device doesn't support drafts.");
            } else if (saveResult.state === "ERROR") {
                console.log('Problem saving record, error: ' + JSON.stringify(saveResult.error));
            } else {
                console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
            }
        
        }));
	},
    cancelSaveRecord : function(component, event, helper){
		component.set("v.curView", "baseView" );
	}
})