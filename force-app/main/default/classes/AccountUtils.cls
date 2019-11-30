public class AccountUtils {
    public static List<Account> accountsByState(String state) {
        
        List<Account> myAccounts = [SELECT Id, Name FROM Account where BillingState =:state];
        return myAccounts;
    }
}