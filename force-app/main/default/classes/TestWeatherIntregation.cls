public with sharing class TestWeatherIntregation {
    public String city{get;set;}
    public String temp{get;set;}
    public String pressure{get;set;}
    public String humidity{get;set;}
    public String minTemp{get;set;}
    public String maxTemp{get;set;}

    public TestWeatherIntregation(Apexpages.StandardController stdController) {

        Property__c prop = (Property__c)stdController.getRecord();
        prop = [select Id, Name,Street_Address__c from Property__c where Id =:prop.Id];

        String propCity= prop.Street_Address__c;
        String apiKey =String.valueOf(413);
        apiKey+= 'a8a78d14c96d677aaad4537d9f674';
        
        String requestEndPoint ='https://api.openweathermap.org/data/2.5/weather?q=';
        
        requestEndPoint+=propCity;
        requestEndPoint+='&APPID='+apiKey;
	     system.debug(requestEndPoint);
        Http http =new Http();
        HttpRequest request =new HttpRequest();        
        request.setEndpoint(requestEndPoint);
        request.setMethod('GET');
        HttpResponse respone= http.send(request);

       /* if (Integer.valueOf(results.get('name'))===200 ){*/
            Map<String,Object> results= (Map<String,Object>)JSON.deserializeUntyped(respone.getBody());
            city = String.valueOf(results.get('name'));
            Map<String,Object> dtlsResults= (Map<String,Object>)(results.get('main'));
            temp =String.valueOf(dtlsResults.get('temp'));
			temp = String.valueOf(math.floor(Double.valueOf(temp)/10).intValue());
            pressure =String.valueOf(dtlsResults.get('pressure'));
            humidity =String.valueOf(dtlsResults.get('humidity')) +'%';
            minTemp =String.valueOf(dtlsResults.get('temp_min'));
			minTemp = String.valueOf(math.ceil(Double.valueOf(minTemp)/10).intValue());
            maxTemp =String.valueOf(dtlsResults.get('temp_max'));
            maxTemp = String.valueOf(math.ceil(Double.valueOf(maxTemp)/10).intValue());
           
            
       /* //}*/

    }
}