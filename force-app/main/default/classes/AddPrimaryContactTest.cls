@isTest
public class AddPrimaryContactTest {
    @isTest static void TestList(){
		List<Account> listAcc =new List<Account>();
        for (Integer i =1; i<=50;i++){
            listAcc.add(new Account(BillingState = 'NY', name = 'Test'+i)); 
        }
     for (Integer i =1; i<=50;i++){
            listAcc.add(new Account(BillingState = 'CA', name = 'TestCA'+i)); 
        }
        insert listAcc;
        
    	Contact co = new Contact();
         co.FirstName='demo';
         co.LastName ='demo';
         insert co;
         String state = 'CA';
      
          AddPrimaryContact apc = new AddPrimaryContact(co, state);
          Test.startTest();
            System.enqueueJob(apc);
          Test.stopTest();
}
    }