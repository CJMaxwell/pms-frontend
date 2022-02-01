import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ICreateOrEditDeliverableDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'app-potential-client',
    templateUrl: './potential-client.component.html',
    styleUrls: ['./potential-client.component.css']
})
export class PotentialClientComponent implements OnInit {
    @Input() pClients: ICreateOrEditDeliverableDto;

    potentialClientForm: FormGroup;
    constructor(private fb: FormBuilder) {
        this.potentialClientForm = this.fb.group({
            potentialClients: this.fb.array([]),
        });
    }

    ngOnInit() {
        if (this.pClients) {
            this.potentialClientForm = new FormGroup({
                potentialClients: new FormArray(this.pClients.potentialClients.map(res => new FormGroup({
                    name: new FormControl(res.name),
                    potentialRevenue: new FormControl(res.potentialRevenue),
                    description: new FormControl(res.description),
                    id: new FormControl(res.id)
                })))
            })
        }

        // this.feedbackForm = new FormArray(this.data.map(x => new FormGroup({
        //     'question': new FormControl(x.description),
        //     'answer': new FormControl('')
        // })))

    }
    potentialClients(): FormArray {
        return this.potentialClientForm.get("potentialClients") as FormArray
    }

    newPotentialClient(): FormGroup {
        return this.fb.group({
            name: '',
            potentialRevenue: '',
            description: '',
            id: ''
        })
    }

    addPotentialClient() {
        this.potentialClients().push(this.newPotentialClient());
    }

    removePotentialClient(i: number, pc) {
        let potentialClientId = pc.value.id;
        if (potentialClientId) {
            //Delete from server
        }
        this.potentialClients().removeAt(i);
    }

    existingPotentialClients() {
        return this.pClients.potentialClients.map(pc => this.potentialClientForm.setValue(new FormGroup({

        })))
    }

}
