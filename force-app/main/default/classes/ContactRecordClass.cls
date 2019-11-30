public class ContactRecordClass {
    @AuraEnabled
    public static List<Contact> getAllCOntacts(String acctId){
        return [select Id,name,LastName,MobilePhone,MailingState,MailingStreet,Email 
                from Contact where AccountId =:acctId]
               /*uvC4lMdSQuMCXtMI18XBu4ln where MobilePhone in ('9614166550','9126339151')*/;
    }
    
	@AuraEnabled
    public static Contact CreateContactMethod(Contact con, Id Accountid){
        con.AccountId = Accountid;
        insert con;
        return con;
    }
}