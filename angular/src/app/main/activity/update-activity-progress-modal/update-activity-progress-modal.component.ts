import { Component, OnInit, Output, EventEmitter, ViewChild, Injector, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { IActivityWithOrganizationUnit } from '../IActivityWithOrganizationUnit';
import { CreateOrEditPerformanceActivityDto, PerformanceActivitiesServiceProxy, DataTypeEnum, UnitsEnum, ComparisonMethodEnum, CompletionStatusEnum, UpdateActivityProgressDto, ActivityAttachmentDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { finalize } from 'rxjs/operators';
import { AppConsts } from '@shared/AppConsts';
import * as moment from 'moment';

@Component({
    selector: 'app-update-activity-progress-modal',
    templateUrl: './update-activity-progress-modal.component.html',
    styleUrls: ['./update-activity-progress-modal.component.css']
})
export class UpdateActivityProgressModalComponent extends AppComponentBase {

    organizationUnitId: number;

    @Output() modalSave: EventEmitter<IActivityWithOrganizationUnit> = new EventEmitter<IActivityWithOrganizationUnit>();

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    active = false;
    saving = false;

    isShown = false;

    updateActivityDto: UpdateActivityProgressDto = new UpdateActivityProgressDto();
    performanceActivity: CreateOrEditPerformanceActivityDto = new CreateOrEditPerformanceActivityDto();
    attachments: ActivityAttachmentDto[] = new Array();
    activityAttachment: ActivityAttachmentDto = new ActivityAttachmentDto();
    preCompletionLevel = 0;
    //escalatedToPartner: boolean;

    dataTypeEnum = DataTypeEnum;
    unitEnum = UnitsEnum;
    comparisonMethodEnum = ComparisonMethodEnum;
    completionStatusEnum = CompletionStatusEnum;

    uploadUrl: string;
    uploadedFiles: any[] = [];

    actualStartDate: Date;
    actualCompletionDate: Date;

    constructor(
        injector: Injector,
        private _performanceActivityService: PerformanceActivitiesServiceProxy,
        private _changeDetector: ChangeDetectorRef,
    ) {
        super(injector);
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/DemoUiComponents/UploadFiles';
    }

    show(indicatorId: number): void {
        this._performanceActivityService
            .getPerformanceActivityForEdit(indicatorId)
            .subscribe(result => {
                this.performanceActivity = result.performanceActivity;
                this.attachments = result.attachments;
                this.preCompletionLevel = result.performanceActivity.completionLevel;
                //this.escalatedToPartner = result.performanceActivity.escalatedToPartner;

                if (result.performanceActivity.actualStartDate) {
                    this.actualStartDate = result.performanceActivity.actualStartDate.toDate();
                }
                if (result.performanceActivity.actualCompletionDate) {
                    this.actualCompletionDate = result.performanceActivity.actualCompletionDate.toDate();
                }

                this.active = true;
                this.modal.show();
                this._changeDetector.detectChanges();
            });
    }

    save(): void {
        this.saving = true;

        let levelUpdate = this.preCompletionLevel + this.performanceActivity.completionLevel;
        if (levelUpdate < 0 || levelUpdate > 100) {
            this.notify.info('Progress level should be between 0% to 100%!');
            this.saving = false;
            return;
        }

        if (this.actualStartDate) {
            this.performanceActivity.actualStartDate = moment(this.actualStartDate);
        } else {
            this.performanceActivity.actualStartDate = null;
        }

        if (this.actualCompletionDate) {
            this.performanceActivity.actualCompletionDate = moment(this.actualCompletionDate);
        } else {
            this.performanceActivity.actualCompletionDate = null;
        }

        this.updateActivityDto.activity = this.performanceActivity;
        this.updateActivityDto.attachments = this.attachments;

        this._performanceActivityService.updateProgress(this.updateActivityDto)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    onUpload(event): void {

        let resultArray = event.originalEvent.body.result;
        let files = event.files;

        for (let i = 0; i < resultArray.length; i++) {
            let attachment = new ActivityAttachmentDto();

            attachment.documentId = resultArray[i].id;
            attachment.fileName = files[i].name;
            attachment.fileFormat = files[i].type;
            attachment.performanceActivityId = this.performanceActivity.id;

            this.attachments.push(attachment);
        }
    }

    onBeforeSend(event): void {
        if (!this.performanceActivity.completionLevel) {
            this.message.info('Please update completion level before uploading attachment');
            return;
        }
        event.xhr.setRequestHeader('Authorization', 'Bearer ' + abp.auth.getToken());
    }

    downloadResourceFile(attachment: ActivityAttachmentDto): string {
        return AppConsts.remoteServiceBaseUrl +
            '/File/DownloadBinaryFile?id=' +
            attachment.documentId +
            '&contentType=' +
            attachment.fileFormat +
            '&fileName=' +
            attachment.fileName;
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

}
