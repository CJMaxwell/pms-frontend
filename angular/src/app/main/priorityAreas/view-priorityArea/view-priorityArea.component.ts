import { Component, OnInit, ViewEncapsulation, Injector, ChangeDetectorRef, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DeliverablesServiceProxy, GetDeliverableForEditOutput, CreateOrEditDeliverableDto, PriorityAreasServiceProxy, GetPriorityAreaForEditOutput, CreateOrEditPriorityAreaDto, GetPerformanceIndicatorForEditOutput, GetPerformanceReviewForEditOutput, GetPerformanceActivityForEditOutput, CommonLookupServiceProxy, NameValueOfInt64 } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { finalize, filter } from 'rxjs/operators';
import { Location } from '@angular/common';
import { IBasicOrganizationUnitInfo } from '@app/admin/organization-units/basic-organization-unit-info';
import { OrganizationUnitMembersComponent } from '@app/admin/organization-units/organization-unit-members.component';
import { PerformanceIndicatorsComponent } from '@app/main/indicators/PerformanceIndicators/PerformanceIndicators.component';
import { PerformanceActivityComponent } from '@app/main/activity/performanceActivity/performanceActivity.component';
import { PerformanceReviewComponent } from '@app/main/deliverables/reviews/performance-review/performance-review.component';
import { OrganizationTreeComponent } from '@app/admin/organization-units/organization-tree.component';
import * as moment from 'moment';
import * as jsPDF from 'jspdf';
import { cloneDeep } from 'lodash';

@Component({
    selector: 'app-view-priorityArea',
    templateUrl: './view-priorityArea.component.html',
    styleUrls: ['./view-priorityArea.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ViewPriorityAreaComponent extends AppComponentBase implements OnInit {

    @Output() deliverableSelected = new EventEmitter<IBasicOrganizationUnitInfo>();

    @ViewChild('ouMembers', { static: true }) ouMembers: OrganizationUnitMembersComponent;
    @ViewChild('ouIndicators', { static: true }) ouIndicators: PerformanceIndicatorsComponent;
    @ViewChild('ouActivities', { static: true }) ouActivities: PerformanceActivityComponent;
    @ViewChild('ouReviews', { static: true }) ouReviews: PerformanceReviewComponent;

    @ViewChild('content', { static: true }) content: ElementRef;

    organizationUnit: IBasicOrganizationUnitInfo = null;

    loading = false;

    deliverables: GetDeliverableForEditOutput[] = new Array();
    filteredDeliverables: GetDeliverableForEditOutput[] = new Array();
    indicators: GetPerformanceIndicatorForEditOutput[] = new Array();
    filteredIndicators: GetPerformanceIndicatorForEditOutput[] = new Array();
    activities: GetPerformanceActivityForEditOutput[] = new Array();
    filteredActivities: GetPerformanceActivityForEditOutput[] = new Array();
    reviews: GetPerformanceReviewForEditOutput[] = new Array();
    filteredReviews: GetPerformanceReviewForEditOutput[] = new Array();
    mdaList: NameValueOfInt64[] = new Array();
    selectedMda = -1;
    selectedDeliverableId = -1;

    priorityArea: CreateOrEditPriorityAreaDto = new CreateOrEditPriorityAreaDto();
    percentageAchieved = 0;
    reportDate: moment.Moment;

    constructor(
        injector: Injector,
        private _deliverablesServiceProxy: DeliverablesServiceProxy,
        private _priorityAreasServiceProxy: PriorityAreasServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _changeDetector: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _location: Location,
    ) {
        super(injector);
        _commonLookupServiceProxy.getAllMdas().subscribe(result => {
            this.mdaList = result;
        });
    }

    ngOnInit() {
        this.reportDate = moment();
        this._activatedRoute.params.subscribe((params: Params) => {

            if (params.priorityAreaId) {
                let priorityAreaId = +params['priorityAreaId'];
                this.getDeliverables(priorityAreaId);
                this.getPriorityArea(priorityAreaId);
            }

        });
    }

    getDeliverables(priorityAreaId: number): void {
        this.loading = true;
        this._deliverablesServiceProxy.getForPriorityArea(priorityAreaId)
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe(result => {
                this.deliverables = result.deliverables.items;
                this.indicators = result.indicators.items;
                this.activities = result.activities.items;
                this.reviews = result.reviews.items;

                this.filteredDeliverables = this.deliverables;
                this.filteredIndicators = this.indicators;
                this.filteredActivities = this.activities;
                this.filteredReviews = this.reviews;

                const sum = this.deliverables.reduce((a, b) => a + b.percentageAchieved, 0);
                this.percentageAchieved = sum / this.deliverables.length;

                this.filterMdas();
            });
    }

    filterMdas(): void {
        let mdas = this.deliverables.map(x => {
            let y = new NameValueOfInt64();
            y.value = x.deliverable.mdaId;
            y.name = x.mdaName;
            return y;
        });

        let mymap = new Map();

        this.mdaList = mdas.filter(el => {
            const val = mymap.get(el.name);
            if (val) {
                if (el.value < val) {
                    mymap.delete(el.name);
                    mymap.set(el.name, el.value);
                    return true;
                } else {
                    return false;
                }
            }
            mymap.set(el.name, el.value);
            return true;
        });
    }

    getPriorityArea(priorityAreaId: number): void {
        this._priorityAreasServiceProxy.getPriorityAreaForEdit(priorityAreaId)
            .subscribe(result => {
                this.priorityArea = result.priorityArea;
            });
    }

    filerByMda(): void {
        if (this.selectedMda == -1) {
            this.filteredDeliverables = this.deliverables;
        } else {
            this.filteredDeliverables = this.deliverables.filter(x => x.deliverable.mdaId == this.selectedMda);
        }
    }

    filterByDeliverable(): void {
        if (this.selectedDeliverableId === -1) {
            this.filteredIndicators = this.indicators;
            this.filteredActivities = this.activities;
            this.filteredReviews = this.reviews;
        } else {
            this.filteredIndicators = this.indicators.filter(x => x.performanceIndicator.organizationUnitId == this.selectedDeliverableId);
            this.filteredActivities = this.activities.filter(x => x.performanceActivity.organizationUnitId == this.selectedDeliverableId);
            this.filteredReviews = this.reviews.filter(x => x.review.organizationUnitId == this.selectedDeliverableId);
        }
        console.log(this.filteredIndicators);
        this._changeDetector.detectChanges();
    }

    deliverableSelect(deliverable: CreateOrEditDeliverableDto) {
        this.ouSelected(<IBasicOrganizationUnitInfo>{
            id: deliverable.id,
            displayName: deliverable.displayName
        });
    }

    ouSelected(event: any): void {
        this.organizationUnit = event;
        this.ouMembers.organizationUnit = event;
        this.ouIndicators.organizationUnit = event;
        this.ouActivities.organizationUnit = event;
        this.ouReviews.organizationUnit = event;
    }

    goBack(): void {
        this._location.back();
    }

    print() {
        let doc = new jsPDF();
        let specialElementHandlers = {
            '#editor': function(element, renderer) {
                return true;
            }
        };

        let content = this.content.nativeElement.innerHTML;

        content = this.cleanupDisplayLabels(content);

        doc.fromHTML(content, 10, 10, {
            'width': 180,
            'elementHandlers': specialElementHandlers
        });

        doc.save('Status Report ('+ this.reportDate.format("ddd, MMM DD, YYYY hh:mm a") +')');

    }

    cleanupDisplayLabels(content) {
        content = content.replace("Priority Area", "");
        content = content.replace("Select MDA", "");
        content = content.replace("Select a Deliverable", "");
        return content;
    }
}
