declare module "@salesforce/apex/DescribeObjectHelper.retreieveObjects" {
  export default function retreieveObjects(): Promise<any>;
}
declare module "@salesforce/apex/DescribeObjectHelper.getListOfFields" {
  export default function getListOfFields(param: {objectAPIName: any}): Promise<any>;
}
declare module "@salesforce/apex/DescribeObjectHelper.retreieveRecords" {
  export default function retreieveRecords(param: {objectName: any, fieldAPINames: any}): Promise<any>;
}
declare module "@salesforce/apex/DescribeObjectHelper.getChildObject" {
  export default function getChildObject(param: {objectListApiName: any}): Promise<any>;
}
