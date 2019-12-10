/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { LightningElement, track, wire, api } from 'lwc';

import retreieveObjects from '@salesforce/apex/DescribeObjectHelper.retreieveObjects';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


let i=0;
let objStr;
//let selectedRows;
//define data table columns
const columns = [
    { label: 'Object Label', fieldName: 'ObjectLabel' },
    { label: 'Object API Name', fieldName: 'ObjectAPIName' },
    { label: 'Record Count', fieldName: 'recordCount',sortable: 'true' },
    { label: 'Size(KB)', fieldName: 'size' ,sortable: 'true' }, 
];
export default class listOfAllsObjects extends LightningElement {

     //this is for showing toast message
     _title = 'Retrieve Records Error';
     message = 'Select atleast one field';
     variant = 'error';
     variantOptions = [
         { label: 'error', value: 'error' },
         { label: 'warning', value: 'warning' },
         { label: 'success', value: 'success' },
         { label: 'info', value: 'info' },
     ];
    @track objectItems = [];    //this holds the array for records with table data
    @track sortBy;
    @track sortDirection;
    @track columns = columns;   //columns for List of Objects datatable
    @track selectedFieldsValue='';  //Objects selected in datatable
    @track tableData;  //data for list of Objects datatable
    @track showScreen=false;        

    @wire(retreieveObjects)
    wiredObjects({ error, data }) {
        if (data) {
            //console.log('check:'+data);
            objStr = JSON.parse(data);
            for(i=0; i<objStr.length; i++) {
                this.objectItems = [ {ObjectLabel: objStr[i].ObjectLabel,
                                    ObjectAPIName: objStr[i].ObjectAPIName, 
                                        recordCount: objStr[i].recordCount, 
                                        size: objStr[i].size},
                                    ...this.objectItems];   
                /*console.log('MasterLabel=' + data[i].MasterLabel
                    + 'QualifiedApiName=' + data[i].QualifiedApiName);*/
                /*this.items = [...this.items ,{value: data[i].QualifiedApiName,
                                              label: data[i].MasterLabel}];*/
               /*  this.objectItems = [
                {ObjectLabel: data[i].MasterLabel, ObjectAPIName: data[i].QualifiedApiName},...this.objectItems];*/
               // console.log('data:'+JSON.stringify(this.objectItems));
        }
        // console.log('data:'+this.objectItems);
            this.tableData = this.objectItems;
            this.showScreen=true;
            console.log(this.showScreen);
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    handleSortdata(event) {
        // field name
        this.sortBy = event.detail.fieldName;

        // sort direction
        this.sortDirection = event.detail.sortDirection;

        // calling sortdata function to sort the data based on direction and selected field
        this.sortData(event.detail.fieldName, event.detail.sortDirection);
    }

    sortData(fieldname, direction) {
        // serialize the data before calling sort function
        let parseData = JSON.parse(JSON.stringify(this.tableData));

        // Return the value stored in the field
        let keyValue = (a) => {
            return Number(a[fieldname]);
        };

        // cheking reverse direction 
        let isReverse = direction === 'asc' ? 1: -1;

        // sorting data 
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';

            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });

        // set the sorted data to data table data
        this.tableData = parseData;

    }

    //this method is fired based on row selection of List of Objects datatable
    handleRowAction(event){
        const selectedRows = event.detail.selectedRows;
       // selectedRows = event.detail.selectedRows;
        this.selectedFieldsValue = '';
        // Display that fieldName of the selected rows in a comma delimited way
        for ( i = 0; i < selectedRows.length; i++){
            if(this.selectedFieldsValue !=='' ){
                this.selectedFieldsValue = this.selectedFieldsValue + ','
                                        + selectedRows[i].ObjectAPIName;
            }
            else{
                this.selectedFieldsValue = selectedRows[i].ObjectAPIName;
            }
        }
        console.log( this.selectedFieldsValue);
    }

    //this method is fired when retrieve records button is clicked
    handlesClick(){
        
        const selectedFieldsValueParam = this.selectedFieldsValue;
        const showComp = this.showScreen;
        //console.log('Hi' +showComp);
        // console.log('selectedFieldsValueParam=='+this.selectedFieldsValue);
        // console.log('selectedFieldsValueParam= '+selectedFieldsValueParam);

        //show error if no rows have been selected
        if(selectedFieldsValueParam ===null || selectedFieldsValueParam===''){
            const evt = new ShowToastEvent({
                title: this._title,
                message: this.message,
                variant: this.variant,
            });
            this.dispatchEvent(evt);
        }
        else {
            //propage event to next component
            const evtCustomEvent = new CustomEvent('retreive', {
                detail: { selectedFieldsValueParam,showComp}
                });
            this.dispatchEvent(evtCustomEvent);
        }
    }
    
    handleResetClick(){
        const evtCustomEvent = new CustomEvent('reset');
        this.dispatchEvent(evtCustomEvent);
    }

}