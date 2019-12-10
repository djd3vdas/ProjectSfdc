/* eslint-disable vars-on-top */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable no-console */
import { LightningElement, wire, api, track } from 'lwc';

import retrieveChildObjects from '@salesforce/apex/DescribeObjectHelper.getChildObject';
import createRecords from '@salesforce/apex/DescribeObjectHelper.createRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


let i=0;
let j=0;
let args=[]; //holding arguments that is passed through event
let columnFields;
let itemValue; //holds each item with first letter in upper case
var itemParentObj;
var itemChildObj;

export default class listOfChildObj extends LightningElement {
    @track returnMessage;
    @api objectName = ''; //holding objectName value which is passed from other component
    @api fieldAPINames = ''; //holds list of fields API Name which is passed from other component
    items=[];
    @track data=[];
    @track columns;
    @track isRecordsVisible; //decision to make if this dynamic table to be shown.
    @track compShow=false;
    @track childSeqNum;
    @track arrayValue=[];
    childItems=[];
    parentItems=[{parObj:'',parValue:''}];
     myList=[
                        { item : '', value : '', parentObjName:''}
                  ];
    //retrieve data from databased

    @track mapOfListValues = [];


    constructor(){
        super();
        this.Fields = {
            parentVal: '',
            parentName: '',
           // childArray: [],

        };
        this.ChildSeq = {
            childObjName: '',
            ChildVal: '',
            parentObjName: '',
           // childArray: [],

        };
    }
  
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
        // console.log('retriveRecordHandler is fired');
        args = JSON.parse(JSON.stringify(event.detail));

        this.objectListApiName = args.selectedFieldsValueParam;
        
        this.isRecordsVisible = args.showComp;
    }

    handleParentSequence(event){
            this.Fields.parentVal = event.target.value;
            this.Fields.parentName = event.target.dataset.item;
            var listToDelete =[this.Fields.parentName,''];
            var end = 0;
            for ( j = 0; j < this.parentItems.length; j++) {
                var obj = this.parentItems[j];

                if (listToDelete.indexOf(obj.parObj) === -1) {
                   // console.log('object in loop ='+j+'   ===== '+JSON.stringify(obj));
                    this.parentItems[end++] = obj;
                }
            }
            this.parentItems.length = end;
            this.parentItems=[...this.parentItems,{parObj:this.Fields.parentName,
                parValue:this.Fields.parentVal}];
           // console.log(JSON.stringify(this.parentItems));


    }

    handleChildSequence(event){
        let foundelement =this.myList.find(ele => ele.item == event.target.dataset.item && ele.parentObjName == event.target.dataset.parent);
       // console.log(JSON.stringify(foundelement));
        if (foundelement === undefined ){
             var deleteNull =[''];
             var lastPos = 0;
             for (var n = 0; n < this.myList.length; n++) {
                 var obj1 = this.myList[n];
                 if (deleteNull.indexOf(obj1.item) === -1 ) {
                     this.myList[lastPos++] = obj1;
                 }
             }
             this.myList.length = lastPos;
 
             this.myList =[...this.myList,{item: event.target.dataset.item,
                                             value:event.target.value,
                                             parentObjName:event.target.dataset.parent,
                                          }];
           // console.log("Un==="+ JSON.stringify(this.myList));
         }else if((foundelement !==undefined && foundelement.item === event.target.dataset.item) && 
                    (foundelement.parentObjName == event.target.dataset.parent)){
 
            // console.log(event.target.dataset.item +'  ======= '+ event.target.dataset.parent);

             for(var m=0;m<this.myList.length;m++){

                 if((this.myList[m].item === event.target.dataset.item) && 
                    (this.myList[m].parentObjName === event.target.dataset.parent)){
                     this.myList[m].value = event.target.value;
                     break;

                 }
                 }
             }else if((foundelement !==undefined && foundelement.item === event.target.dataset.item) && 
                        (foundelement.parentObjName !== event.target.dataset.parent)){
                            this.myList =[...this.myList,{item: event.target.dataset.item,
                                                    value:event.target.value,
                                                    parentObjName:event.target.dataset.parent
                                                    }];
            }
         }



    handleClick(){
        
        createRecords({listOfValue : JSON.stringify(this.myList),listOfParentValue: JSON.stringify(this.parentItems)})
        .then(result => {
            this.returnMessage = result;
            const evt = new ShowToastEvent({
                title: 'Success',
                message: 'Records are Inserted',
                variant: 'success',
            });
            this.compShow=true;
            const myComp=this.compShow;
            this.isRecordsVisible =false;
            console.log('Hiii===== '+this.compShow);
            const evtCustomEvent = new CustomEvent('retreive', {
                detail: {myComp}
                });
            this.dispatchEvent(evtCustomEvent);
            this.dispatchEvent(evt);

            console.log('Result=== '+result);
        })
        .catch(error => {
            console.log('Error== '+error);
            this.error = error;
            const evt = new ShowToastEvent({
                title: 'Error on data save',
                message:  error.message.body,
                variant: 'error',
            });
            this.dispatchEvent(evt);
        });

        if(this.returnMessage == 'Success'){
            const showNewComp= this.compShow;
            this.isRecordsVisible =false;
            console.log('Hiii===== '+showNewComp);
            const evtCustomEvent = new CustomEvent('retreive', {
                detail: {showNewComp}
                });
            this.dispatchEvent(evtCustomEvent);
        }
        
    }
    handleResetClick(){
        this.selectedFieldsValue='';
        this.isRecordsVisible =false;
        const evtCustomEvent = new CustomEvent('reset');
        this.dispatchEvent(evtCustomEvent);
    }
    resetHandler(){
        //console.log(this.selectedFieldsValue);
        this.mapOfListValues=[];
        this.isRecordsVisible = false;
        this.parentItems=[];
        this.selectedFieldsValue='';
    }



}