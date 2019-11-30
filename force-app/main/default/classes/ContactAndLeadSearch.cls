public class ContactAndLeadSearch{
    public static List<List<SObject>> searchContactsAndLeads(String srchString){
        List<List<SObject>> searchList = 
            [FIND :srchString IN ALL FIELDS RETURNING 
			Contact(FirstName ,LastName where FirstName =:srchString or LastName = :srchString),
            Lead(FirstName ,LastName where FirstName =:srchString or LastName = :srchString)];
        return searchList;
    }
}