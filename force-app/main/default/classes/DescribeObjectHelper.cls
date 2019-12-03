public inherited sharing class DescribeObjectHelper {
    //Retrieve all the objects from org
    @AuraEnabled (cacheable=true)
    public static List<EntityDefinition> retreieveObjects(){
        return [SELECT Id, MasterLabel,  
                    DeveloperName, 
                    QualifiedApiName 
                    FROM EntityDefinition 
                    WHERE IsApexTriggerable = true
                    ORDER BY MasterLabel desc];
    }

    //Retrieve field details based on Object API Name
    @AuraEnabled (cacheable=true)
    public static String getListOfFields(String objectAPIName){
        Map<string, string> fieldList = new Map<string, string>();
        if(!String.isEmpty(objectAPIName)){
            Map<String, String> mapField = new Map<String, String>();
            Map<string,SObjectField> lstFields = 
                schema.getGlobalDescribe().get(objectAPIName).getDescribe().fields.getMap();

            for(String str: lstFields.keySet()){
                mapField.put(str, lstFields.get(str).getDescribe().getLabel());
            }
            System.debug(JSON.serializePretty(mapField));
            return JSON.serializePretty(mapField);
        }
        return null;
    }

    //Retrieve records based on selected fields and object.
    @AuraEnabled (cacheable=true)
    public static List<SObject> retreieveRecords(String objectName, String fieldAPINames){
        String strQuery = 'SELECT ' + String.escapeSingleQuotes(fieldAPINames) 
                        + ' FROM ' 
                        + String.escapeSingleQuotes(objectName) 
                        + ' LIMIT 20';
        return database.query(strQuery);
    }

   @AuraEnabled(cacheable=true)
    public static Map<String,List<String>> getChildObject(String objectListApiName){
        List<String> listObjApi= objectListApiName.split(',');
         System.debug(listObjApi);        
        Map<String,List<String>> objectListMap=new Map<String,List<String>>();

        // Make the describe call
            Schema.DescribeSobjectResult[] results = Schema.describeSObjects(listObjApi);
            //System.debug('Got describe information for ' + results.size() + ' sObjects.');
            // For each returned result, get some info
            for(Schema.DescribeSobjectResult res : results) {
                List<String> listSobj = new List<String>();
                Schema.ChildRelationship[] rels = res.getChildRelationships();
                for (Schema.ChildRelationship cr: rels) {
                        listSobj.add(String.valueOf(cr.getChildSObject()));
                      //  system.debug('====child object==='+cr.getChildSObject());
                    }
                List<String> listSobjNew = new List<String>(new Set<String>(listSobj));
                objectListMap.put(res.getLabel(), listSobjNew);
                /*if (rels.size() > 0) {
                    System.debug(res.getName() + ' has ' + rels.size() + ' child relationships.');
                }*/
            }
           // System.debug(objectListMap);
            return objectListMap;
        }
    
		public class ItemClass{
            public String item{get;set;}
            public String value {get;set;}
            public String parentObjName {get;set;}
    	}
        @AuraEnabled
         public static Integer createRecords(String listOfValue){
             Integer i=0;
             system.debug('Hi=='+ listOfValue);
             /* Deserialize from Array of Object to List of ItemClass Wrapper*/
             List<ItemClass> lstItem = (List<ItemClass>) JSON.deserialize(listOfValue, List<ItemClass>.class);
             System.debug('lstItem=' + lstItem);
             List<Object_Sequence__c> addData= new List<Object_Sequence__c>();
             for(ItemClass obj: lstItem){
                 addData.add(new Object_Sequence__c(Child_Object_API_Name__c = obj.item,
                                                   	Child_Object_Sequence_No__c = Integer.valueOf(obj.value),
                                                   Parent_Object_API_Name__c = obj.parentObjName));
                i++;                                                   
             }
             try{
                insert addData;
             }catch(DmlException e){
                 System.debug('An unexpected error has occurred: ' + e.getMessage());
             }
             return i;
         }
   
    
 }