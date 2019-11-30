public class ContactSearch {
	public static List<Contact> searchForContacts(String name, String postalCode)
    {
        List<Contact> conSearch = [Select Id, Name from Contact where LastName =:name and MailingPostalCode=:postalCode];
        return conSearch;
    }
}