import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OrganizationTreeComponent } from './organization-tree.component';
import { OrganizationUnitMembersComponent } from './organization-unit-members.component';
import { OrganizationUnitRolesComponent } from './organization-unit-roles.component';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';
import { PerformanceIndicatorsComponent } from '@app/main/indicators/PerformanceIndicators/PerformanceIndicators.component';
import { PerformanceActivityComponent } from '@app/main/activity/performanceActivity/performanceActivity.component';
import { PerformanceReviewComponent } from '@app/main/deliverables/reviews/performance-review/performance-review.component';
import { CreateEditDeliverableModalComponent } from '@app/main/deliverables/create-edit-deliverable-modal/create-edit-deliverable-modal.component';


@Component({
    templateUrl: './organization-units.component.html',
    animations: [appModuleAnimation()]
})
export class OrganizationUnitsComponent extends AppComponentBase {

    //@ViewChild('ouMembers', {static: true}) ouMembers: OrganizationUnitMembersComponent;
    //@ViewChild('ouRoles', {static: true}) ouRoles: OrganizationUnitRolesComponent;
    @ViewChild('ouIndicators', { static: true }) ouIndicators: PerformanceIndicatorsComponent;
    @ViewChild('ouActivities', { static: true }) ouActivities: PerformanceActivityComponent;
    @ViewChild('ouReviews', { static: true }) ouReviews: PerformanceReviewComponent;
    @ViewChild('ouTree', { static: true }) ouTree: OrganizationTreeComponent;
    @ViewChild('createOrEditDeliverableModal', { static: true }) createOrEditDeliverableModal: CreateEditDeliverableModalComponent;


    organizationUnit: IBasicOrganizationUnitInfo = null;



    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    ouSelected(event: any): void {
        this.organizationUnit = event;
        //this.ouMembers.organizationUnit = event;
        //this.ouRoles.organizationUnit = event;
        this.ouIndicators.organizationUnit = event;
        this.ouActivities.organizationUnit = event;
        this.ouReviews.organizationUnit = event;
    }
    addDeliverable(): void {
        this.createOrEditDeliverableModal.show(this.organizationUnit.id, this.organizationUnit.displayName, null);
    }

}
