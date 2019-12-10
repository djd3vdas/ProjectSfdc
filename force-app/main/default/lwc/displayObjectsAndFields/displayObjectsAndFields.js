/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';

//import retreieveObjects from '@salesforce/apex/DescribeObjectHelper.retreieveObjects';
import retreieveParentObjects from '@salesforce/apex/DescribeObjectHelper.retreieveParentObjects'
import getListOfFields from '@salesforce/apex/DescribeObjectHelper.getListOfFields';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createBORecords from '@salesforce/apex/DescribeObjectHelper.createBORecords';

/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 300;

//define data table columns
const columns = [
    { label: 'Field Label', fieldName: 'FieldLabel' },
    { label: 'Field API Name', fieldName: 'FieldAPIName' },
];

let i=0;
let objStr;
export default class DisplayObjectsAndFields extends LightningElement {
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
    @track value = '';  //this displays selected value of combo box
    @track items = []; //this holds the array for records with value & label
    @track fieldItems = []; //this holds the array for records with table data

    @track columns = columns;   //columns for List of fields datatable
    @track selectedFieldsValue=''; //fields selected in datatable
    @track selectedQueryFieldsValue='';
    @track tableData;   //data for list of fields datatable
    @track showNewComp;
    //retrieve object information to be displayed in combo box and prepare an array
    // @wire(retreieveObjects)
    // wiredObjects({ error, data }) {
    //     if (data) {

    //         for(i=0; i<data.length; i++) {
    //             /*console.log('MasterLabel=' + data[i].MasterLabel
    //                 + 'QualifiedApiName=' + data[i].QualifiedApiName);*/
    //             this.items = [...this.items ,{value: data[i].QualifiedApiName,
    //                                           label: data[i].MasterLabel}];
    //         }
    //         this.error = undefined;
    //     } else if (error) {
    //         this.error = error;
    //         this.data = undefined;
    //     }
    // }

    //retrieve object information to be displayed in combo box and prepare an array
    @wire(retreieveParentObjects)
    wiredObjects({ error, data }) {
        if (data) {
            console.log('Data'+JSON.stringify(data));
            for(i=0; i<data.length; i++) {
                /*console.log('MasterLabel=' + data[i].MasterLabel
                    + 'QualifiedApiName=' + data[i].QualifiedApiName);*/
                this.items = [...this.items ,{value: data[i],
                                              label: data[i]}];
            }
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }


    //retrieve combo-box values as status options
    get statusOptions() {
        return this.items;
    }

    //retrieve field information based on selected object API name.
    @wire(getListOfFields,{objectAPIName: '$value'})
    wiredFields({ error, data }) {
        if (data) {
            //first parse the data as entire map is stored as JSON string
            objStr = JSON.parse(data);

            //now loop through based on keys
            for(i of Object.keys(objStr)){
                console.log('FieldAPIName=' +i + 'FieldLabel=' + objStr[i]);
                //spread function is used to stored data and it is reversed order
                this.fieldItems = [
                    {FieldLabel: objStr[i], FieldAPIName: i},...this.fieldItems];  
            }
            this.tableData = this.fieldItems;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    //this method is fired based on combo-box item selection
    handleChange(event) {
        // get the string of the "value" attribute on the selected option
        const selectedOption = event.detail.value;
        console.log('selectedOption=' + selectedOption);
        this.value = selectedOption;
        this.fieldItems = []; //initialize fieldItems array
        this.tableData = [];  //initialize list of fields datatable data

        //deplay the processing
        window.clearTimeout(this.delayTimeout);

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.value = selectedOption;
        }, DELAY);

    }

    queryCondition(event){
        this.selectedQueryFieldsValue =  event.target.value;
    }

    //this method is fired based on row selection of List of fields datatable
    handleRowAction(event){
        const selectedRows = event.detail.selectedRows;
        this.selectedFieldsValue = '';
        // Display that fieldName of the selected rows in a comma delimited way
        for ( i = 0; i < selectedRows.length; i++){
            if(this.selectedFieldsValue !=='' ){
                this.selectedFieldsValue = this.selectedFieldsValue + ','
                                        + selectedRows[i].FieldAPIName;
            }
            else{
                this.selectedFieldsValue = selectedRows[i].FieldAPIName ;
            }
        }

    }

    //this method is fired when retrieve records button is clicked
    handleClick(){
        const valueParam = this.value;
        const selectedFieldsValueParam = this.selectedFieldsValue;
        const selectedQueryCondition = this.selectedQueryFieldsValue;
       
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
            /* Create Record */
            createBORecords({ objName : valueParam , listOfFields: selectedFieldsValueParam , queryCondition:selectedQueryCondition})
            .then(result => {
                this.message = result;
                this.error = undefined;
                if(this.message !== undefined) {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: ' Created',
                            variant: 'success',
                        }),
                    );
                   
                }
            })
            .catch(error => {
                this.message = undefined;
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                console.log("error", JSON.stringify(this.error));
            });
            /*End of Create Record*/
            //propage event to next component
            this.showNewComp=false;
            const myCompVisible= this.showNewComp;
            this.value = '';
            this.tableData = [];
            console.log('Onclick DF==='+myCompVisible);
            const evtCustomEvent = new CustomEvent('retreive', {
                detail: {valueParam, selectedFieldsValueParam, selectedQueryCondition,myCompVisible}
                });
            this.dispatchEvent(evtCustomEvent);
        }



    }

    //this method is fired when reset button is clicked.
    handleResetClick(){
        this.value = '';
        this.tableData = [];
        this.showNewComp=false;
        console.log('Reset DF==='+this.showNewComp);
        const evtCustomEvent = new CustomEvent('reset');
        this.dispatchEvent(evtCustomEvent);
    }
}