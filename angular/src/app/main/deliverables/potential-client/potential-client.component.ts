import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { IPotentialClientDTO } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'app-potential-client',
    templateUrl: './potential-client.component.html',
    styleUrls: ['./potential-client.component.css']
})
export class PotentialClientComponent implements OnInit {
    @Input() pClients: IPotentialClientDTO[];

    potentialClientForm: FormGroup;
    constructor(private fb: FormBuilder) {
        this.potentialClientForm = this.fb.group({
            potentialClients: this.fb.array([]),
        });
    }

    ngOnInit() {
        console.log(this.pClients, 'PCs');
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

    removePotentialClient(i: number) {
        this.potentialClients().removeAt(i);
    }

}
