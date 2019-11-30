trigger AccountAddressTrigger on Account (before insert,before update) {
	
    for(Account acc: Trigger.new){
        
        if(acc.Match_Billing_Address__c){
            acc.ShippingPostalCode = acc.BillingPostalCode;
        }
    }
}



/*trigger ClosedOpportunityTrigger on Opportunity (after insert,after update) {
    
    List<Task> taskList=new List<Task>(); 

    for(Opportunity Opp:Trigger.New){
        if(Trigger.isInsert || Trigger.isUpdate)
          if(opp.StageName=='Closed Won')
              taskList.add(new task(Subject='Follow Up Test Task',
                                 WhatId=opp.Id));
    }
    
    if(taskList.size()>0)
        insert taskList;

}*/