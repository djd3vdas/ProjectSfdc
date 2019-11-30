({
	getMessage : function(component, event, helper) {
		var param = event.getParam('arguments');
        var fname = component.get('v.fname');
        var lname = component.get('v.lname');
        component.set('v.output',fname+" "+lname);
        if(param){
            alert(param.param1+" "+param.param2);                     
        }  
        
	}
})