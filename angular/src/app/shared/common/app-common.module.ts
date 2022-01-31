import { CreateEditDeliverableModalComponent } from './../../main/deliverables/create-edit-deliverable-modal/create-edit-deliverable-modal.component';
import { AbpModule } from '@abp/abp.module';
import * as ngCommon from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { CommonModule } from '@shared/common/common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { ModalModule, TabsModule, BsDropdownModule, BsDatepickerModule, BsDatepickerConfig, BsDaterangepickerConfig } from 'ngx-bootstrap';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { CommonLookupModalComponent } from './lookup/common-lookup-modal.component';
import { EntityTypeHistoryModalComponent } from './entityHistory/entity-type-history-modal.component';
import { EntityChangeDetailModalComponent } from './entityHistory/entity-change-detail-modal.component';
import { DateRangePickerInitialValueSetterDirective } from './timing/date-range-picker-initial-value.directive';
import { DatePickerInitialValueSetterDirective } from './timing/date-picker-initial-value.directive';
import { DateTimeService } from './timing/date-time.service';
import { TimeZoneComboComponent } from './timing/timezone-combo.component';
import { CustomizableDashboardComponent } from './customizable-dashboard/customizable-dashboard.component';
import { WidgetGeneralStatsComponent } from './customizable-dashboard/widgets/widget-general-stats/widget-general-stats.component';
import { DashboardViewConfigurationService } from './customizable-dashboard/dashboard-view-configuration.service';
import { GridsterModule } from 'angular-gridster2';
import { WidgetDailySalesComponent } from './customizable-dashboard/widgets/widget-daily-sales/widget-daily-sales.component';
import { WidgetEditionStatisticsComponent } from './customizable-dashboard/widgets/widget-edition-statistics/widget-edition-statistics.component';
import { WidgetHostTopStatsComponent } from './customizable-dashboard/widgets/widget-host-top-stats/widget-host-top-stats.component';
import { WidgetIncomeStatisticsComponent } from './customizable-dashboard/widgets/widget-income-statistics/widget-income-statistics.component';
import { WidgetMemberActivityComponent } from './customizable-dashboard/widgets/widget-member-activity/widget-member-activity.component';
import { WidgetProfitShareComponent } from './customizable-dashboard/widgets/widget-profit-share/widget-profit-share.component';
import { WidgetRecentTenantsComponent } from './customizable-dashboard/widgets/widget-recent-tenants/widget-recent-tenants.component';
import { WidgetRegionalStatsComponent } from './customizable-dashboard/widgets/widget-regional-stats/widget-regional-stats.component';
import { WidgetSalesSummaryComponent } from './customizable-dashboard/widgets/widget-sales-summary/widget-sales-summary.component';
import { WidgetSubscriptionExpiringTenantsComponent } from './customizable-dashboard/widgets/widget-subscription-expiring-tenants/widget-subscription-expiring-tenants.component';
import { WidgetTopStatsComponent } from './customizable-dashboard/widgets/widget-top-stats/widget-top-stats.component';
import { FilterDateRangePickerComponent } from './customizable-dashboard/filters/filter-date-range-picker/filter-date-range-picker.component';
import { AddWidgetModalComponent } from './customizable-dashboard/add-widget-modal/add-widget-modal.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CountoModule } from 'angular2-counto';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { SingleLineStringInputTypeComponent } from './input-types/single-line-string-input-type/single-line-string-input-type.component';
import { ComboboxInputTypeComponent } from './input-types/combobox-input-type/combobox-input-type.component';
import { CheckboxInputTypeComponent } from './input-types/checkbox-input-type/checkbox-input-type.component';
import { CreateEditMdaModalComponent } from '@app/main/mdas/create-edit-mda-modal/create-edit-mda-modal.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PerformanceIndicatorsComponent } from '@app/main/indicators/PerformanceIndicators/PerformanceIndicators.component';
import { UpdateIndicatorProgressComponent } from '@app/main/indicators/update-indicator-progress/update-indicator-progress.component';
import { ViewIndicatorComponent } from '@app/main/indicators/view-indicator/view-indicator.component';
import { EditorModule } from 'primeng/editor';
import { PerformanceActivityComponent } from '@app/main/activity/performanceActivity/performanceActivity.component';
import { CreateEditActivityModalComponent } from '@app/main/activity/create-edit-activity-modal/create-edit-activity-modal.component';
import { UpdateActivityProgressModalComponent } from '@app/main/activity/update-activity-progress-modal/update-activity-progress-modal.component';
import { ViewReviewModalComponent } from '@app/main/deliverables/reviews/view-review-modal/view-review-modal.component';
import { CreateEditReviewModalComponent } from '@app/main/deliverables/reviews/create-edit-review-modal/create-edit-review-modal.component';
import { TargetUpdateModalComponent } from '@app/main/indicators/target-update-modal/target-update-modal.component';
import { OrganizationUnitsComponent } from '@app/admin/organization-units/organization-units.component';
import { OrganizationTreeComponent } from '@app/admin/organization-units/organization-tree.component';
import { OrganizationUnitMembersComponent } from '@app/admin/organization-units/organization-unit-members.component';
import { OrganizationUnitRolesComponent } from '@app/admin/organization-units/organization-unit-roles.component';
import { CreateOrEditUnitModalComponent } from '@app/admin/organization-units/create-or-edit-unit-modal.component';
import { AddMemberModalComponent } from '@app/admin/organization-units/add-member-modal.component';
import { AddRoleModalComponent } from '@app/admin/organization-units/add-role-modal.component';
import { TreeModule } from 'primeng/tree';
import { DragDropModule } from 'primeng/dragdrop';
import { ContextMenuModule } from 'primeng/contextmenu';
import { FileUploadModule } from 'primeng/fileupload';
import { CreateEditPerformanceIndicatorComponent } from '@app/main/indicators/createEditPerformanceIndicator/createEditPerformanceIndicator.component';
import { ViewTargetProgressLogModalComponent } from '@app/main/indicators/view-target-progress-log-modal/view-target-progress-log-modal.component';
import { ViewActivityProgressLogModalComponent } from '@app/main/activity/view-activity-progress-log-modal/view-activity-progress-log-modal.component';
import { ViewActivityComponent } from '@app/main/activity/view-activity/view-activity.component';
import { PerformanceReviewComponent } from '@app/main/deliverables/reviews/performance-review/performance-review.component';
import { PotentialClientComponent } from '@app/main/deliverables/potential-client/potential-client.component';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        UtilsModule,
        AbpModule,
        CommonModule,
        TableModule,
        TreeModule,
        DragDropModule,
        ContextMenuModule,
        PaginatorModule,
        GridsterModule,
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxChartsModule,
        BsDatepickerModule.forRoot(),
        PerfectScrollbarModule,
        CountoModule,
        AppBsModalModule,
        AutoCompleteModule,
        EditorModule,
        FileUploadModule
    ],
    declarations: [
        ViewActivityProgressLogModalComponent,
        ViewTargetProgressLogModalComponent,
        AddMemberModalComponent,
        AddRoleModalComponent,
        CreateOrEditUnitModalComponent,
        OrganizationUnitRolesComponent,
        OrganizationUnitMembersComponent,
        OrganizationTreeComponent,
        OrganizationUnitsComponent,
        ViewReviewModalComponent,
        CreateEditReviewModalComponent,
        PerformanceReviewComponent,
        TargetUpdateModalComponent,
        ViewActivityComponent,
        UpdateActivityProgressModalComponent,
        CreateEditActivityModalComponent,
        PerformanceActivityComponent,
        ViewIndicatorComponent,
        UpdateIndicatorProgressComponent,
        CreateEditPerformanceIndicatorComponent,
        PerformanceIndicatorsComponent,
        CreateEditDeliverableModalComponent,
        CreateEditMdaModalComponent,
        TimeZoneComboComponent,
        CommonLookupModalComponent,
        EntityTypeHistoryModalComponent,
        EntityChangeDetailModalComponent,
        DateRangePickerInitialValueSetterDirective,
        DatePickerInitialValueSetterDirective,
        CustomizableDashboardComponent,
        WidgetGeneralStatsComponent,
        WidgetDailySalesComponent,
        WidgetEditionStatisticsComponent,
        WidgetHostTopStatsComponent,
        WidgetIncomeStatisticsComponent,
        WidgetMemberActivityComponent,
        WidgetProfitShareComponent,
        WidgetRecentTenantsComponent,
        WidgetRegionalStatsComponent,
        WidgetSalesSummaryComponent,
        WidgetSubscriptionExpiringTenantsComponent,
        WidgetTopStatsComponent,
        FilterDateRangePickerComponent,
        AddWidgetModalComponent,
        SingleLineStringInputTypeComponent,
        ComboboxInputTypeComponent,
        CheckboxInputTypeComponent,
        PotentialClientComponent

    ],
    exports: [
        ViewActivityProgressLogModalComponent,
        ViewTargetProgressLogModalComponent,
        AddMemberModalComponent,
        AddRoleModalComponent,
        CreateOrEditUnitModalComponent,
        OrganizationUnitRolesComponent,
        OrganizationUnitMembersComponent,
        OrganizationTreeComponent,
        OrganizationUnitsComponent,
        TargetUpdateModalComponent,
        ViewReviewModalComponent,
        CreateEditReviewModalComponent,
        PerformanceReviewComponent,
        ViewActivityComponent,
        UpdateActivityProgressModalComponent,
        CreateEditActivityModalComponent,
        PerformanceActivityComponent,
        UpdateIndicatorProgressComponent,
        ViewIndicatorComponent,
        CreateEditPerformanceIndicatorComponent,
        PerformanceIndicatorsComponent,
        CreateEditDeliverableModalComponent,
        CreateEditMdaModalComponent,
        TimeZoneComboComponent,
        CommonLookupModalComponent,
        EntityTypeHistoryModalComponent,
        EntityChangeDetailModalComponent,
        DateRangePickerInitialValueSetterDirective,
        DatePickerInitialValueSetterDirective,
        CustomizableDashboardComponent,
        NgxChartsModule
    ],
    providers: [
        DateTimeService,
        AppLocalizationService,
        AppNavigationService,
        DashboardViewConfigurationService,
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig }
    ],

    entryComponents: [
        WidgetGeneralStatsComponent,
        WidgetDailySalesComponent,
        WidgetEditionStatisticsComponent,
        WidgetHostTopStatsComponent,
        WidgetIncomeStatisticsComponent,
        WidgetMemberActivityComponent,
        WidgetProfitShareComponent,
        WidgetRecentTenantsComponent,
        WidgetRegionalStatsComponent,
        WidgetSalesSummaryComponent,
        WidgetSubscriptionExpiringTenantsComponent,
        WidgetTopStatsComponent,
        FilterDateRangePickerComponent,
        SingleLineStringInputTypeComponent,
        ComboboxInputTypeComponent,
        CheckboxInputTypeComponent
    ]
})
export class AppCommonModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppCommonModule,
            providers: [
                AppAuthService,
                AppRouteGuard
            ]
        };
    }
}
