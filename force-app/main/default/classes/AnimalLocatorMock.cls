@istest
public class AnimalLocatorMock implements HttpCalloutMock {
    
    public httpresponse respond(httprequest req){
                
        httpresponse Response=new httpresponse();
        response.setStatusCode(200);
        response.setBody('{"animals":{"id":1,"name":"chicken","eats":"chicken food","says":"cluck cluck"}}');
         
        return response;
    }

}