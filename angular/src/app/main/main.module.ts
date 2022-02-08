import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { PriorityAreasComponent } from './priorityAreas/priorityAreas/priorityAreas.component';
import { CreateOrEditPriorityAreaModalComponent } from './priorityAreas/priorityAreas/create-or-edit-priorityArea-modal.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginatorModule } from 'primeng/paginator';
import { EditorModule } from 'primeng/editor';
import { InputMaskModule } from 'primeng/inputmask';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { UtilsModule } from '@shared/utils/utils.module';
import { CountoModule } from 'angular2-counto';
import { ModalModule, TabsModule, TooltipModule, BsDropdownModule, PopoverModule } from 'ngx-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainRoutingModule } from './main-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FileUploadModule as PrimeNgFileUploadModule } from 'primeng/fileupload';

import { BsDatepickerModule, BsDatepickerConfig, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { TreeDragDropService } from 'primeng/api';
import { ViewPriorityAreaComponent } from './priorityAreas/view-priorityArea/view-priorityArea.component';
import { MDAComponent } from './mdas/mdas/mda.component';;

NgxBootstrapDatePickerConfigService.registerNgxBootstrapDatePickerLocales();

@NgModule({
    imports: [
        FileUploadModule,
        AutoCompleteModule,
        PaginatorModule,
        EditorModule,
        InputMaskModule,
        TableModule,
        CommonModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        MainRoutingModule,
        CountoModule,
        NgxChartsModule,
        PrimeNgFileUploadModule,
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        PopoverModule.forRoot()
    ],
    declarations: [
        ViewPriorityAreaComponent,
        PriorityAreasComponent,
        CreateOrEditPriorityAreaModalComponent,
        DashboardComponent,
        MDAComponent,
    ],
    providers: [
        TreeDragDropService,
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig },
        { provide: BsLocaleService, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerLocale }
    ]
})
export class MainModule { }
