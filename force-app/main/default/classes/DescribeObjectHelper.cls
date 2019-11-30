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
 }