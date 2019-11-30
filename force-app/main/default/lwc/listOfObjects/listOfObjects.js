/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';

import retreieveObjects from '@salesforce/apex/DescribeObjectHelper.retreieveObjects';


let i=0;
//define data table columns
const columns = [
    { label: 'Object Label', fieldName: 'ObjectLabel' },
    { label: 'Object API Name', fieldName: 'ObjectAPIName' },
];
export default class ListOfObjects extends LightningElement {
    @track value = '';  //this displays selected value of combo box
    @track items = []; //this holds the array for records with value & label
    @track fieldItems = []; //this holds the array for records with table data

    @track columns = columns;   //columns for List of fields datatable
    @track selectedFieldsValue=''; //fields selected in datatable
    @track tableData;   //data for list of fields datatable

    @wire(retreieveObjects)
    wiredObjects({ error, data }) {
        if (data) {

            for(i=0; i<data.length; i++) {
                /*console.log('MasterLabel=' + data[i].MasterLabel
                    + 'QualifiedApiName=' + data[i].QualifiedApiName);*/
                /*this.items = [...this.items ,{value: data[i].QualifiedApiName,
                                              label: data[i].MasterLabel}];*/
                this.fieldItems = [
                {ObjectLabel: data[i].MasterLabel, ObjectAPIName: data[i].QualifiedApiName},...this.fieldItems];
}           
            this.tableData = this.fieldItems;

            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

}