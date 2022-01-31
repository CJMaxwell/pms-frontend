import { CreateOrEditDeliverableDto, NameValueOfString, CommonLookupServiceProxy, NameValueOfInt32 } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, ViewChild, Output, EventEmitter, Injector, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DeliverablesServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { PotentialClientComponent } from '../potential-client/potential-client.component';

export interface IDeliverableOnEdit {
    id?: number;
    parentId?: number;
    displayName?: string;
}

@Component({
    selector: 'app-create-edit-deliverable-modal',
    templateUrl: './create-edit-deliverable-modal.component.html',
    styleUrls: ['./create-edit-deliverable-modal.component.css']
})
export class CreateEditDeliverableModalComponent extends AppComponentBase implements OnInit {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('client', { static: false }) potentialClients: PotentialClientComponent;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    deliverable: CreateOrEditDeliverableDto = new CreateOrEditDeliverableDto();
    mdaName = '';

    filteredPriorityAreas: NameValueOfInt32[];
    priorityArea: any;
    priorityAreas: NameValueOfInt32[] = new Array<NameValueOfInt32>();

    constructor(
        injector: Injector,
        private _deliverableServiceProxy: DeliverablesServiceProxy,
        private _commonServiceProxy: CommonLookupServiceProxy,
        private _changeDetector: ChangeDetectorRef
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    onShown(): void {
        document.getElementById('deliverableDisplayName').focus();
    }

    show(mdaId: number, mdaName: string, deliverableId?: number): void {
        this.mdaName = mdaName;
        if (!deliverableId) {
            this.deliverable = new CreateOrEditDeliverableDto();
            this.deliverable.id = deliverableId;
            this.deliverable.mdaId = mdaId;
            this.priorityArea = new NameValueOfInt32();

            this.active = true;
            this.modal.show();
            this._changeDetector.detectChanges();
        } else {
            this._deliverableServiceProxy.getDeliverableForEdit(deliverableId).subscribe(result => {
                this.deliverable = result.deliverable;
                this.mdaName = result.mdaName;

                if (result.deliverable.priorityAreaId) {
                    this.priorityArea = new NameValueOfInt32();
                    this.priorityArea.value = result.deliverable.priorityAreaId;
                    this.priorityArea.name = result.priorityAreaName;
                }

                this.active = true;
                this.modal.show();
                this._changeDetector.detectChanges();
            });
        }
    }

    // get countries
    filterPriorityArea(event): void {
        this._commonServiceProxy.getPriorityAreas(event.query).subscribe(result => {
            this.filteredPriorityAreas = result;
        });
    }

    selectPriorityArea(event): void {
        //console.log(event);
        this.deliverable.priorityAreaId = this.priorityArea.value;
    }

    save(): void {
        this.deliverable.potentialClients = this.potentialClients.potentialClientForm.value.potentialClients;
        this.saving = true;
        this._deliverableServiceProxy
            .createOrEdit(this.deliverable)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

}
