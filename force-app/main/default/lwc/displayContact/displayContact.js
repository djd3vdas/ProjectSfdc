/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import { LightningElement, api, wire, track } from 'lwc';

import getContacts from '@salesforce/apex/AccountController.getContacts';
let i=0;

export default class DisplayContact extends LightningElement {
     /** Id of record to display. */
    @api recordId; //this captures AccountId which is passed from Parent Component
    @track error;   //this holds errors

    @track items = []; //this holds the array for records with value & label

    @track value = '';  //this displays selected value of combo box

    /* Load Contacts based on AccountId from Controller */
    @wire(getContacts, { accountId: '$recordId'})
    wiredContacts({ error, data }) {
        if (data) {
            for(i=0; i<data.length; i++) {
                console.log('id=' + data[i].Id);
                this.items = [...this.items ,{value: data[i].Id , label: data[i].Name}];                                   
            }                
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
    }
   
    //getter property from statusOptions which return the items array
    get statusOptions() {
        console.log(this.items);
        return this.items;
    }

    handleChange(event) {
        // Get the string of the "value" attribute on the selected option
        const selectedOption = event.detail.value;
        console.log('selectedOption=' + selectedOption);

        //This is for event propagation
        
        const filterChangeEvent = new CustomEvent('filterchange', {
            detail: { selectedOption },
        });

        
        // Fire the custom event
        this.dispatchEvent(filterChangeEvent);
    }
    
}