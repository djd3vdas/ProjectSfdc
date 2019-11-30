({
	doContactSave : function(component, event, helper) {      
      // alert('HI');
        var action =component.get('c.CreateContactMethod');        
        
        action.setParams({
            con : component.get('v.createContact'),            
            Accountid : component.get('v.accntId')          
        });
        
        action.setCallback(this, function(a){            
            var state =  a.getState();
           // alert(state);
            if(state === 'SUCCESS' || state === 'DRAFT'){
                var reponseValue = a.getReturnValue();
            }else if(state === 'INCOMPLETE'){
                
            }else if(state === 'ERROR'){
                
            }
        },'ALL');
        $A.enqueueAction(action);
        
	}
})