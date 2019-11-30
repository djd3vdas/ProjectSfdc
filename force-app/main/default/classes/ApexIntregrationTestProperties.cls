@RestResource(urlMapping='/test/PropertiesManagement/')
global with sharing class ApexIntregrationTestProperties {
    
    //Wrapper Class
    global class PropertyInfo{
        Property__c propInfo{get; set;}
    }

    @httpPost
    global static Property__c doCreateProperty(PropertyInfo proDtls){  /*Wrapper Class Example*/

        Property__c newProp = proDtls.propInfo;
        insert newProp;
        return newProp;
    }
    /*  Data Through WBench for Wrapper Class Enample
       {
        "proDtls" :{
            "propInfo" :{
                "Name":"Shubha",
                "Price__c": 130,
                "Street_Address__c":"Barasat"
             }
         }
        }   
     */


    /*global static Property__c doCreateProperty(String propName, Double propPrice, String propAddress){  

        Property__c newProp = new Property__c(Name=propName, Price__c=propPrice, Street_Address__c=propAddress);        
        insert newProp;
        return newProp;
    }*/

    /* JSON Format Data Send Through WorkBench
    {
        "propName":"Aru",
        "propPrice": 500,
        "propAddress": "Balurghat"
     }*/

    @httpGet
    global static Property__c doGetProperty(){

        Property__c getProp = new Property__c();
        Map<String,String> paramMap= RestContext.request.params;
        String propId =paramMap.get('Id');
        getProp = [ SELECT Id,Name,Price__c,Street_Address__c FROM Property__c where Id = :propId ];
        return getProp;
    }

    @httpPut
    global static Property__c doUpdateProperty(String propName,Double propPrice){
        
        Map<String,String> paramMap= RestContext.request.params;
        String propId =paramMap.get('Id');
        //System.debug(propId);
        Property__c updtProp = new Property__c(Name=propName, Price__c=propPrice, Id =propId);
        update updtProp;
        return updtProp;
    }
    
   

    @httpDelete
    global static String doDeleteProperty(){
        
        Property__c getProp = new Property__c();
        Map<String,String> paramMap= RestContext.request.params;
        String propId =paramMap.get('Id');
        getProp = [ SELECT Id,Name,Price__c,Street_Address__c FROM Property__c where Id = :propId ];
        delete getProp;
        return 'Sucessfully Deleted!';
    }

    

}