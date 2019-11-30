/* eslint-disable eqeqeq */
/* eslint-disable no-console */
import { LightningElement, wire, api, track } from 'lwc';

import retrieveChildObjects from '@salesforce/apex/DescribeObjectHelper.getChildObject';

let i=0;
let args=[]; //holding arguments that is passed through event
let columnFields;
let itemValue; //holds each item with first letter in upper case


export default class listOfChildObj extends LightningElement {
    
    @api objectName = ''; //holding objectName value which is passed from other component
    @api fieldAPINames = ''; //holds list of fields API Name which is passed from other component

    items=[];
    @track data=[];
    @track columns;
    @track isRecordsVisible; //decision to make if this dynamic table to be shown.
    @track childSeqNum;
    @track arrayValue=[];
    childItems=[];
    parentItems=[];
    //retrieve data from databased

    @track mapOfListValues = [];
  
    @wire(retrieveChildObjects,{objectListApiName:'$objectListApiName'})
    wiredObjects({data, error}) {
        if(data) {
            for(let key in data) {
                // Preventing unexcepted data
                if (data.hasOwnProperty(key)) { // Filtering the data in the loop
                    this.mapOfListValues.push({key: key, value: data[key]});
                    console.log('key= ' + key);
                    console.log('Value of Key= '+ data[key]);
                }
            }
        }
        else if(error) {
            console.log('Error');
            window.console.log(error);
        }
    }

    retriveRecordHandler(event){
        console.log('retriveRecordHandler is fired');
        args = JSON.parse(JSON.stringify(event.detail));

        this.objectListApiName = args.selectedFieldsValueParam;
        console.log('this.objectName='+ this.objectListApiName);

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
    
    handleParentSequence(event){
        this.parentItems = [...this.parentItems ,event.target.dataset.item,
                            event.target.value];
         console.log(this.parentItems);
    }

    handleChildSequence(event){
        console.log(event.target.dataset.parent);
        console.log(this.parentItems);
        this.childItems = [...this.childItems ,event.target.dataset.item,
                                               event.target.value];
            console.log(this.childItems);
    }
}