({
	getAllContactsRecord : function(component, event, helper) {
		var action = component.get("c.getAllCOntacts");
        //var rec = component.get('v.recordId');
       // alert("record id:=>"+ component.get('v.recordId'))
        /* Method for Filtering the Component by the account id */
        action.setParams({
            acctId : component.get('v.recordId'),
        })
        action.setCallback(this, function(a){
            component.set("v.contactRecord", a.getReturnValue());
            //alert("contat record:=>"+ component.get('v.contactRecord'))
        });
        $A.enqueueAction(action);
	},
    
})