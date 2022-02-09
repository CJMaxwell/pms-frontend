import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { PriorityAreasServiceProxy, CreateOrEditPriorityAreaDto, UserServiceProxy, UserListDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditPriorityAreaModal',
    templateUrl: './create-or-edit-priorityArea-modal.component.html'
})
export class CreateOrEditPriorityAreaModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    partners: UserListDto[];


    priorityArea: CreateOrEditPriorityAreaDto = new CreateOrEditPriorityAreaDto();



    constructor(
        injector: Injector,
        private _priorityAreasServiceProxy: PriorityAreasServiceProxy,
        private _userServiceProxy: UserServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this._userServiceProxy.getUsers().subscribe({
            next: (res) => this.partners = res.items.filter(user => user.roles.find(u => u.roleName == "Partner"))
        })
    }

    show(priorityAreaId?: number): void {

        if (!priorityAreaId) {
            this.priorityArea = new CreateOrEditPriorityAreaDto();
            this.priorityArea.id = priorityAreaId;

            this.active = true;
            this.modal.show();
        } else {
            this._priorityAreasServiceProxy.getPriorityAreaForEdit(priorityAreaId).subscribe(result => {
                this.priorityArea = result.priorityArea;

                this.active = true;
                this.modal.show();
            });
        }

    }

    save(): void {
        this.saving = true;


        this._priorityAreasServiceProxy.createOrEdit(this.priorityArea)
            .pipe(finalize(() => { this.saving = false; }))
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
