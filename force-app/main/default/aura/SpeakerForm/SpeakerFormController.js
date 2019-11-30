/*
    onSuccess: function(component,event,helper){
        //Show Success message on upsertion of record
        var resultToast = $A.get("e.force:showToast");
        resultToast.setParams({
                            "title": "Success!",
                            "message": "Record Saved Successfully"
                        });
        resultToast.fire();
        //Navigate to sObject home page
        var homeEvent = $A.get("standard__objectPage");
    	homeEvent.setParams({
        	"scope": "Speaker__c"
    	});
    	homeEvent.fire();
    }
})*/
({

    onSuccess: function(component,event,helper){
       var recId = component.get("v.recordId");
     
        var nagigateLightning = component.find('navigate');
        //Show Success message on upsertion of record
        var resultToast = $A.get("e.force:showToast");
        resultToast.setParams({
            				type: 'success',
                            "title": "Success!",
                            "message":  " Record Updated Successfully!!!!"
                        });
        resultToast.fire();
        //Navigate to sObject home page
        //The variable "homeEvent" instructs the Lightning Framework to call the "standard__objectPage" event. 
        //This event is used to navigate to the object home page after the record is successfully created.
        
   var pageReference = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Speaker__c',
                actionName: 'list'
            },
            state: {
                filterName: 'Recent'
            } 
        };
        nagigateLightning.navigate(pageReference);
    
        
    var homeEvent = $A.get("standard__objectPage");
        	homeEvent.setParams({
        	"scope": "Speaker__c"
    	});
        
    	homeEvent.fire();
    }
})