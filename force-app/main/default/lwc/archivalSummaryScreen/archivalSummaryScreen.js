/* eslint-disable no-console */
import { LightningElement, track,wire } from 'lwc';
import fetchData from '@salesforce/apex/DescribeObjectHelper.archivalSummaryScreenMethod';

/*const columns = [
    { label: 'Parent Object Name', fieldName: 'parName' },
    { label: 'Parent Object Sequence', fieldName: 'parObjSeq'},
    { label: 'Child Object Name', fieldName: 'childObjName'},
    { label: 'Child Object Sequence', fieldName: 'childObjSeq'},
    // { label: 'Selected Fields', fieldName: 'selectedFields',},
    // { label: 'Query Condition', fieldName: 'queryCondition',},
];*/

const columns = [
    { label: 'Parent Object Name', fieldName: 'parName' },
    { label: 'Selected Fields', fieldName: 'selectedFields'},
    { label: 'Query Condition', fieldName: 'queryCondition'},
    // { label: 'Selected Fields', fieldName: 'selectedFields',},
    // { label: 'Query Condition', fieldName: 'queryCondition',},
];

let i=0;
export default class archivalSummaryScreen extends LightningElement {
  /*   @track returnMessage;
    @api objectName = ''; //holding objectName value which is passed from other component
    @api fieldAPINames = ''; //holds list of fields API Name which is passed from other component
    items=[];
    @track data=[];
    @track isRecordsVisible; //decision to make if this dynamic table to be shown.
    
    //retrieve data from databased
    @track listOfValues = [];
    @wire(fetchData) getRecords; */
    
  
    @track objectItems = [];    //this holds the array for records with table data
    @track columns = columns;   //columns for List of Objects datatable
    @track selectedFieldsValue='';  //Objects selected in datatable
    @track tableData;  //data for list of Objects datatable
    @track mapOfListValues=[];

    @wire(fetchData)
    wiredObjects({ error, data }) {
        if (data) {
            for(i=0; i<data.length; i++) {
                this.objectItems = [...this.objectItems,
                        {parName: data[i].Parent_Object_Name__c,
                            selectedFields: data[i].Selected_Fields__c, 
                            queryCondition: data[i].Query_Condition__c}];

        }
        // console.log('data:'+this.objectItems);
            this.tableData = this.objectItems;
            console.log('check:'+JSON.stringify(this.tableData));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
            console.log('Error:'+this.tableData);
        }
    }
   
}
