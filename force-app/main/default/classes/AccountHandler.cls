public with sharing class AccountHandler {
    public static void insertAccount(Integer n){
        Integer counter = 1;
        //create a list to add our accounts
        List<Account> addAccounts = new List<Account>();
        
        while(counter <= n){
                        
            //create a new account
            Account store = new Account();
            store.Name = 'Acme Inc ' + counter;
            store.AccountNumber = 'A000' + counter;
            addAccounts.add(store);
            
           
            
            //increment the counter
            counter = counter + 1;
            
        }
      insert addAccounts;
    /*public static Account insertNewAccount(String str){
        try{
            Account acc=new Account();
            acc.Name=str;
            insert acc;      
            return acc;
        }
        catch(DMLException ex){
            system.debug('Error Message thrown::'+ex.getMessage());
            return(null);            
        }
    }*/
}
}