@isTest
public class AccountTriggerTest {
    
    @isTest static void TestCreate200Records()
    {
        List<Account> accts = new List<Account>();
        for(Integer i=0; i < 200; i++) 
        {
            Account acct = new Account(Name='Test Account ' + i, BillingState = 'CA');
            accts.add(acct);
        }
        
        Test.startTest();
            insert accts ;
        Test.stopTest();
        
        // Verify that 200 new Accounts were inserted
        List<Account> verifyAccts = [SELECT Id FROM Account];
        System.assertEquals(200, verifyAccts.size());    
                
        // Please query all record once again to check assert
        List<Account> lstAccount = [select ShippingState from Account];
        for (Account a: lstAccount )
        {
            System.assertEquals('CA', a.ShippingState, 'ERROR');
        }
        
    }
}