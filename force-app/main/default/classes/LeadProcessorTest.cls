@isTest
public class LeadProcessorTest {
    public static testMethod void testMethod1(){
        
        List<Lead> listLead =new List<Lead>();
        
        for (Integer i =1; i<=200;i++){
            Lead led = new Lead();
            led.FirstName ='FirstName';
            led.LastName ='LastName'+i;
            led.Company ='xyz'+i;
            listLead.add(led); 
        }
        insert listLead;
        
        Test.startTest();
            LeadProcessor obj = new LeadProcessor();
            DataBase.executeBatch(obj); 
            
        Test.stopTest();
        
    }

}