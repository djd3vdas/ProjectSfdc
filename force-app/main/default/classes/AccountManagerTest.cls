@isTest
private class AccountManagerTest {
    
    // Helper method
        public static Id createTestRecord(){
        Account acc = new Account(Name = 'TestAcc2');
        Insert acc;
         
        Contact con = new Contact(LastName = 'TestCont2', AccountId = acc.Id);
       // Insert con;
        
        return acc.Id;
    }  

    private static testMethod void getAccountTest1() {
        Id recordId = createTestRecord();
        // Set up a test request
        RestRequest request = new RestRequest();
        request.requestUri = 'https://bestcrm.salesforce.com/services/apexrest/Accounts/'+ recordId +'/contacts' ;
        request.httpMethod = 'GET';
        RestContext.request = request;
        // Call the method to test
        Account thisAccount = AccountManager.getAccount();
        // Verify results
       // System.assert(thisAccount != null);
        //ystem.assertEquals('Test REST record', thisAccount.Name);

    }

      
}