declare module "@salesforce/apex/DescribeObjectHelper.retreieveObjects" {
  export default function retreieveObjects(): Promise<any>;
}
declare module "@salesforce/apex/DescribeObjectHelper.retreieveParentObjects" {
  export default function retreieveParentObjects(): Promise<any>;
}
declare module "@salesforce/apex/DescribeObjectHelper.getListOfFields" {
  export default function getListOfFields(param: {objectAPIName: any}): Promise<any>;
}
declare module "@salesforce/apex/DescribeObjectHelper.retreieveRecords" {
  export default function retreieveRecords(param: {objectName: any, fieldAPINames: any, queryableData: any}): Promise<any>;
}
declare module "@salesforce/apex/DescribeObjectHelper.getChildObject" {
  export default function getChildObject(param: {objectListApiName: any}): Promise<any>;
}
declare module "@salesforce/apex/DescribeObjectHelper.createRecords" {
  export default function createRecords(param: {listOfValue: any, listOfParentValue: any}): Promise<any>;
}
