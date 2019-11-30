public class StringArrayTest {
    
    public static List<String> generateStringArray(Integer inputParam){
        Integer start;        
        List<String> returnValue =new List<String>();
        String test='Test ';
        for (start=1; start<=inputParam; start++){
            test = test + String.valueOf(start-1);
            returnValue.add(test);
            //System.debug('Hi------ '+ test);
        }
        return returnValue;
    }
    
}