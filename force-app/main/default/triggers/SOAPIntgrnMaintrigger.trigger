trigger SOAPIntgrnMaintrigger on Contact (after insert,after update) {
contact obj2=new contact();
string fname;
string lname2;
string title1;
id id1;
string emailtest;
contact obj=trigger.new[0];

if ((obj.Name!='' || obj.Name!=null) && (obj.email!='' || obj.email!=null)   )
{
    fname=obj.firstName;
    lname2=obj.lastName;
    title1=obj.Title;
    id1=obj.id;
    emailtest=obj.email;
sendContactToExternalSystem1 obj1=new sendContactToExternalSystem1 ();
obj1.sendcontact(fname,lname2,title1,id1); // Calling helper method...
}

}