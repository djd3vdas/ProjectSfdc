/* eslint-disable no-console */
import { LightningElement,track } from 'lwc';

export default class getArrayHtml2JS extends LightningElement {
    @track myList = [
                        {Name: "MEOW" ,Id : 'I1'} ,
                        {Name: "Bark" ,Id : 'I2'}
                    ];

    updateValues(event){
        // eslint-disable-next-line eqeqeq
        let foundelement = this.myList.find(ele => ele.Id == event.target.dataset.id);
        foundelement.Name = event.target.value;
        this.myList = [...this.myList];

        console.table(JSON.stringify(this.myList));



    }

}