import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ICreateOrEditDeliverableDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

    teamForm: FormGroup;
    @Input() members: ICreateOrEditDeliverableDto;

    constructor(private fb: FormBuilder) {
        this.teamForm = this.fb.group({
            teamMembers: this.fb.array([]),
        });
    }

    ngOnInit() {
        // if (this.members) {
        //     this.teamForm = new FormGroup({
        //         potentialClients: new FormArray(this.members..map(res => new FormGroup({
        //             name: new FormControl(res.name),
        //             potentialRevenue: new FormControl(res.potentialRevenue),
        //             description: new FormControl(res.description),
        //             id: new FormControl(res.id)
        //         })))
        //     });
        // };
    }

    teamMembers(): FormArray {
        return this.teamForm.get("teamMembers") as FormArray
    }

    newTeamMember(): FormGroup {
        return this.fb.group({
            name: '',
            id: ''
        })
    }

    addTeamMember() {
        this.teamMembers().push(this.newTeamMember());
    }

    removeTeamMember(i: number, team) {
        let teamId = team.value.id;
        if (teamId) {
            //Delete from server
        }
        this.teamMembers().removeAt(i);
    }



}
