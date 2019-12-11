public inherited sharing class DescribeObjectHelper {
    //Retrieve all the objects from org
    @AuraEnabled (cacheable=true)
    public static String retreieveObjects(){
        List<EntityDefinition> objectList=new List<EntityDefinition>();
        List<CreateList> objListItem=new List<CreateList>();
        List<String> objListForRecordCount=new List<String>();
        objectList=[SELECT Id, MasterLabel,  DeveloperName, QualifiedApiName FROM EntityDefinition WHERE IsApexTriggerable = true ORDER BY QualifiedApiName desc];
        System.debug('objectList:'+objectList);
        
        for(EntityDefinition ed: objectList)
        {
            objListForRecordCount.add(ed.QualifiedApiName);
            //ed.DeveloperName;
            //ed.QualifiedApiName;
            //objListItem.add(new CreateList());
        }
        
        String objectListWithComma = string.join(objListForRecordCount,',');
        String sizeOfRecords=DataArchivalClass.getStorage(objectListWithComma);
        System.debug('sizeOfRecords:'+sizeOfRecords);
        
        Map<String, Object> newList = (Map<String, Object>)JSON.deserializeUntyped(sizeOfRecords);
        //Map<String, Object> castedObject = (Map<String, Object>)newList;
        System.debug('object:'+newList);
        List<Object> sObjectList=(List<Object>)newList.get('sObjects');
        System.debug('last:'+sObjectList);
        for(Object o: sObjectList)
        {
            Map<String,Object> newMap=(Map<String,Object>)o;
            //System.debug('namevalue:'+newMap.get('name'));
            //System.debug('namevalue:'+newMap.get('count'));
            if(Integer.valueOf(newMap.get('count'))>0)
            {
                objListItem.add(new CreateList(String.valueOf(newMap.get('name')),
                                               String.valueOf(newMap.get('name')),
                                               String.valueOf(newMap.get('count')),
                                               String.valueOf(Integer.valueOf(newMap.get('count'))*2)));
            }
            //System.debug('hello:'+o);
            //System.debug('hello:'+o.get('count'));
        }
        System.debug('Hiiii=== '+JSON.serializePretty(objListItem));
    	return JSON.serializePretty(objListItem);
       /* return [SELECT Id, MasterLabel,  
                    DeveloperName, 
                    QualifiedApiName 
                    FROM EntityDefinition 
                    WHERE IsApexTriggerable = true
                    ORDER BY MasterLabel desc];*/
    }
    @AuraEnabled (cacheable=true)
    public static List<String> retreieveParentObjects(){
        List<Object_Archive__c> objList=[Select Id,Parent_Object_API_Name__c from Object_Archive__c];
        List<String> parentObj=new List<String>();
        List<String> allObjects = new List<String>();
        for(Object_Archive__c o: objList)
        {
            parentObj.add(o.Parent_Object_API_Name__c);
            allObjects.add(o.Parent_Object_API_Name__c);
        }
        List<Object_Sequence__c> objChildList=[Select Id,Child_Object_API_Name__c,Parent_Object_API_Name__c FROM Object_Sequence__c where Parent_Object_API_Name__c=:parentObj];
        for(Object_Sequence__c ob: objChildList)
        {
            allObjects.add(ob.Child_Object_API_Name__c);
        }
		List<String> listSobjNew = new List<String>(new Set<String>(allObjects));
        system.debug('allObjects= '+allObjects);
        System.debug('listSobjNew== '+listSobjNew);
        return listSobjNew;
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
    public static List<SObject> retreieveRecords(String objectName, String fieldAPINames, String queryableData){  
        
        
        String strQuery = 'SELECT ' + String.escapeSingleQuotes(fieldAPINames) 
                        + ' FROM ' 
                        + String.escapeSingleQuotes(objectName) 
                        +' '
                        +(queryableData);
        
        System.debug('Query== '+strQuery);
        
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
        public class ParentItemClass{
            public String parObj{get;set;}
            public String parValue {get;set;}
            
    	}
        public class CreateList{
            public String ObjectLabel;//objectName
            public String ObjectAPIName;
            public String recordCount;
            public String size;
            public CreateList(String ObjectLabel,String ObjectAPIName,String recordCount,String size)
            {
                this.ObjectLabel=ObjectLabel;
                this.ObjectAPIName=ObjectAPIName;
                this.recordCount=recordCount;
                this.size=size;
            }
    }
      @AuraEnabled
         public static String createRecords(String listOfValue, String listOfParentValue){
             Integer i=0;
             system.debug('Hi=='+ listOfValue);
             system.debug('Parent Value=='+ listOfParentValue);
             /* Deserialize from Array of Object to List of ItemClass Wrapper*/
             List<ItemClass> lstItem = (List<ItemClass>) JSON.deserialize(listOfValue, List<ItemClass>.class);
//             List<ItemClass> listSobjNew = new List<ItemClass>(new Set<ItemClass>(lstItem));
             List<ParentItemClass> lstParentItem = (List<ParentItemClass>) JSON.deserialize(listOfParentValue, List<ParentItemClass>.class);
             
             List<Object_Sequence__c> addData= new List<Object_Sequence__c>();
             List<Object_Archive__c> addParentData= new List<Object_Archive__c>();
			 
            for(ParentItemClass objPar: lstParentItem){
                  addParentData.add(new Object_Archive__c(Parent_Object_API_Name__c = objPar.parObj,
                                                            Obj_Seq_Id__c = Integer.valueOf(objPar.parValue),
                                                            Parent_Obj_Name__c = objPar.parObj));
                 for(ItemClass obj: lstItem){
                     if(obj.parentObjName==objPar.parObj){
                         addData.add(new Object_Sequence__c(Child_Object_API_Name__c = obj.item,
                                                            Child_Object_Sequence_No__c = Integer.valueOf(obj.value),
                                                            Parent_Obj_Seq_Id__c=Integer.valueOf(objPar.parValue),
                                                            Parent_Object_API_Name__c =obj.parentObjName));
                     }
              		
                 }
             }
             List<Object_Sequence__c> listSobjNew = new List<Object_Sequence__c>(new Set<Object_Sequence__c>(addData));
             try{
                insert listSobjNew;
                insert addParentData;
             }catch(DmlException e){
                 System.debug('An unexpected error has occurred: ' + e.getMessage());
             }
             return 'Success';
         }
    
    @AuraEnabled
    public static String createBORecords(String objName, String listOfFields, String queryCondition){
       List<Archival_BO_Field__c> newBORecord= new List<Archival_BO_Field__c>(); 
       List<Archival_BO_Field__c> listToUpdate = new List<Archival_BO_Field__c>();
       List<Archival_BO_Field__c> getRecords = [Select Parent_Object_Name__c,Selected_Fields__c,Query_Condition__c
                                              from Archival_BO_Field__c where Parent_Object_Name__c =:objName ];
        
        system.debug('obj== '+ getRecords );
        
        If(getRecords.isEmpty()){
            newBORecord.add(new Archival_BO_Field__c(Parent_Object_Name__c = objName,
                                                   	    Selected_Fields__c = listOfFields,
                                                        Query_Condition__c = queryCondition));
            insert newBORecord;
        }else if(!getRecords.isEmpty()){
            for(Archival_BO_Field__c objUpdt : getRecords) {
                
                if (objUpdt.Parent_Object_Name__c == objName) {
                    	objUpdt.Selected_Fields__c = listOfFields;
                    	objUpdt.Query_Condition__c = queryCondition;
                    listToUpdate.add(objUpdt);
                }
			}
           update listToUpdate;
        }
        
        return 'Success';
    }
    @AuraEnabled (cacheable=true)
    public static List<Object_Sequence__c> archivalSummaryMethod(){
        
        return [Select Child_Object_API_Name__c,Child_Object_Sequence_No__c,Parent_Object_API_Name__c,Parent_Obj_Seq_Id__c 
                FROM Object_Sequence__c order by Parent_Obj_Seq_Id__c,Child_Object_Sequence_No__c];
        
    }
     @AuraEnabled (cacheable=true)
    public static List<Archival_BO_Field__c> archivalSummaryScreenMethod(){
        
        return [Select Parent_Object_Name__c,Selected_Fields__c,Query_Condition__c
                FROM Archival_BO_Field__c order by Parent_Object_Name__c];
        
    }
}