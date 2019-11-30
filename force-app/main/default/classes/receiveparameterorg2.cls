global class receiveparameterorg2{
webservice static string createcontactinorganisationsecond(string name,string name2,string title,string email1)
{
contact obj=new contact();
obj.FirstName=name;
obj.LastName=name2;
obj.Title=title;
obj.email=email1;
insert obj;
return 'successfully inserted';
}

}