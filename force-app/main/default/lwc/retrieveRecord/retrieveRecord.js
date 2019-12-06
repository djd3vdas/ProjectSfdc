/* eslint-disable no-console */
import { LightningElement, wire, api, track } from 'lwc';

import retreieveRecords from '@salesforce/apex/DescribeObjectHelper.retreieveRecords';

let i=0;
let args=[]; //holding arguments that is passed through event
let columnFields;
let itemValue; //holds each item with first letter in upper case

export default class RetrieveRecord extends LightningElement {

    @api objectName = ''; //holding objectName value which is passed from other component
    @api fieldAPINames = ''; //holds list of fields API Name which is passed from other component
    @api queryCondition ='';

    items=[];
    @track data=[];
    @track columns;
    @track isRecordsVisible; //decision to make if this dynamic table to be shown.

    //retrieve data from databased
    @wire(retreieveRecords,{objectName:'$objectName'
                            ,fieldAPINames:'$fieldAPINames',
                            queryableData: '$queryCondition'})
    wiredObjects({ error, data }) {
        if (data) {
            console.log('data in string='+ JSON.stringify(data));
            this.data = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    //due to event propagation this method is called
    retriveRecordHandler(event){
        console.log('retriveRecordHandler is fired');

        args = JSON.parse(JSON.stringify(event.detail));
        //{"valueParam":"Account","selectedFieldsValueParam":"id,name,type"}

        this.objectName = args.valueParam;
        this.fieldAPINames = args.selectedFieldsValueParam;
        this.queryCondition = args.selectedQueryCondition;

        console.log('this.objectName='+ this.objectName);
        console.log('this.fieldAPINames='+ this.fieldAPINames);

        //create columns from fieldAPINames ("id,name,type")
        columnFields = args.selectedFieldsValueParam.split(',');
        
        this.items='';

        //create columns for dynamic data display. Here all fields must be converted to initial letter as upper case
        //e.g id,name,type to transformed to Id, Name, Type
        for(i=0; i<columnFields.length; i++) {
            //make first character as upper case            
            itemValue = columnFields[i].charAt(0).toUpperCase()+columnFields[i].slice(1);
            console.log('columnFields=' + itemValue);
            this.items = [...this.items ,{label: itemValue, 
                                        fieldName: itemValue}];                                   
        } 
        this.columns = this.items;
        this.isRecordsVisible = true;
    }

    //due to event propagation this method is called for reseting datatable
    resetHandler(){
        this.isRecordsVisible = false;
        this.columns = [];
        this.data = [];
    }
}