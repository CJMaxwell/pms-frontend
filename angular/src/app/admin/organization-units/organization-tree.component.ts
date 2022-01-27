import { CreateEditDeliverableModalComponent } from './../../main/deliverables/create-edit-deliverable-modal/create-edit-deliverable-modal.component';
import { OnInit, Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HtmlHelper } from '@shared/helpers/HtmlHelper';
import { ListResultDtoOfOrganizationUnitDto, MoveOrganizationUnitInput, OrganizationUnitDto, OrganizationUnitServiceProxy, MdasServiceProxy, DeliverablesServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';
import { CreateOrEditUnitModalComponent } from './create-or-edit-unit-modal.component';
import { IUserWithOrganizationUnit } from './user-with-organization-unit';
import { IUsersWithOrganizationUnit } from './users-with-organization-unit';
import { IRoleWithOrganizationUnit } from './role-with-organization-unit';
import { IRolesWithOrganizationUnit } from './roles-with-organization-unit';

import { TreeNode, MenuItem } from 'primeng/api';

import { ArrayToTreeConverterService } from '@shared/utils/array-to-tree-converter.service';
import { TreeDataHelperService } from '@shared/utils/tree-data-helper.service';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import { CreateEditMdaModalComponent } from '@app/main/mdas/create-edit-mda-modal/create-edit-mda-modal.component';
import { FileDownloadService } from '@shared/utils/file-download.service';

export interface IOrganizationUnitOnTree extends IBasicOrganizationUnitInfo {
    id: number;
    parent: string | number;
    code: string;
    displayName: string;
    memberCount: number;
    roleCount: number;
    text: string;
    state: any;
}

@Component({
    selector: 'organization-tree',
    templateUrl: './organization-tree.component.html'
})
export class OrganizationTreeComponent extends AppComponentBase implements OnInit {

    @Output() ouSelected = new EventEmitter<IBasicOrganizationUnitInfo>();

    @ViewChild('createOrEditOrganizationUnitModal', { static: true }) createOrEditOrganizationUnitModal: CreateOrEditUnitModalComponent;
    @ViewChild('createOrEditMdaModal', { static: true }) createOrEditMdaModal: CreateEditMdaModalComponent;
    @ViewChild('createOrEditDeliverableModal', { static: true }) createOrEditDeliverableModal: CreateEditDeliverableModalComponent;
    @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;

    treeData: any;
    selectedOu: TreeNode;
    ouContextMenuItems: MenuItem[];
    canManageOrganizationUnits = false;

    _entityTypeFullName = 'Abp.Organizations.OrganizationUnit';

    generatingReport = false;

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private _mdaServiceProxy: MdasServiceProxy,
        private _deliverableServiceProxy: DeliverablesServiceProxy,
        private _arrayToTreeConverterService: ArrayToTreeConverterService,
        private _treeDataHelperService: TreeDataHelperService,
        private _fileDownloadService: FileDownloadService,
    ) {
        super(injector);
    }

    totalUnitCount = 0;

    ngOnInit(): void {
        this.canManageOrganizationUnits = this.isGranted('Pages.Administration.OrganizationUnits.ManageOrganizationTree');
        this.ouContextMenuItems = this.getContextMenuItems();
        this.getTreeDataFromServer();
    }

    nodeSelect(event) {
        this.ouSelected.emit(<IBasicOrganizationUnitInfo>{
            id: event.node.data.id,
            displayName: event.node.data.displayName
        });
    }

    isDroppingBetweenTwoNodes(event: any): boolean {
        return event.originalEvent.target.nodeName === 'LI';
    }

    nodeDrop(event) {
        const input = new MoveOrganizationUnitInput();
        input.id = event.dragNode.data.id;
        let dropNodeDisplayName = '';

        if (this.isDroppingBetweenTwoNodes(event)) {//between two item
            input.newParentId = event.dropNode.parent ? event.dropNode.parent.data.id : null;
            dropNodeDisplayName = event.dropNode.parent ? event.dropNode.parent.data.displayName : this.l('Root');
        } else {
            input.newParentId = event.dropNode.data.id;
            dropNodeDisplayName = event.dropNode.data.displayName;
        }

        this.message.confirm(
            this.l('OrganizationUnitMoveConfirmMessage', event.dragNode.data.displayName, dropNodeDisplayName),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this._organizationUnitService.moveOrganizationUnit(input)
                        .pipe(catchError(error => {
                            this.revertDragDrop();
                            return Observable.throw(error);
                        }))
                        .subscribe(() => {
                            this.notify.success(this.l('SuccessfullyMoved'));
                            this.reload();
                        });
                } else {
                    this.revertDragDrop();
                }
            }
        );
    }

    revertDragDrop() {
        this.reload();
    }

    reload(): void {
        this.getTreeDataFromServer();
    }

    private getTreeDataFromServer(): void {
        let self = this;
        this._organizationUnitService.getOrganizationUnits().subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
            this.totalUnitCount = result.items.length;
            this.treeData = this._arrayToTreeConverterService.createTree(result.items,
                'parentId',
                'id',
                null,
                'children',
                [
                    {
                        target: 'label',
                        targetFunction(item) {
                            return item.displayName;
                        }
                    }, {
                        target: 'expandedIcon',
                        value: 'fa fa-folder-open kt-font--warning'
                    },
                    {
                        target: 'collapsedIcon',
                        value: 'fa fa-folder kt-font--warning'
                    },
                    {
                        target: 'selectable',
                        value: true
                    },
                    {
                        target: 'memberCount',
                        targetFunction(item) {
                            return item.memberCount;
                        }
                    },
                    {
                        target: 'roleCount',
                        targetFunction(item) {
                            return item.roleCount;
                        }
                    },
                    {
                        target: 'indicatorCount',
                        targetFunction(item) {
                            return item.indicatorCount;
                        }
                    },
                    {
                        target: 'activityCount',
                        targetFunction(item) {
                            return item.activityCount;
                        }
                    },
                    {
                        target: 'deliverableCount',
                        targetFunction(item) {
                            return item.deliverableCount;
                        }
                    }
                ]);
        });
    }

    private isEntityHistoryEnabled(): boolean {
        let customSettings = (abp as any).custom;
        return customSettings.EntityHistory && customSettings.EntityHistory.isEnabled && _.filter(customSettings.EntityHistory.enabledEntities, entityType => entityType === this._entityTypeFullName).length === 1;
    }

    private getContextMenuItems(): any[] {

        const canManageOrganizationTree = this.isGranted('Pages.Administration.OrganizationUnits.ManageOrganizationTree');
        const canManageDeliverables = this.isGranted('Pages.Deliverable');

        let items = [
            {
                label: this.l('Edit'),
                disabled: !canManageOrganizationTree,
                command: (event) => {
                    this.editUnit();
                    // this.createOrEditOrganizationUnitModal.show({
                    //     id: this.selectedOu.data.id,
                    //     displayName: this.selectedOu.data.displayName
                    // });
                }
            },
            // {
            //     label: this.l('AddSubUnit'),
            //     disabled: !canManageOrganizationTree,
            //     command: () => {
            //         this.addUnit(this.selectedOu.data.id);
            //     }
            // },
            {
                label: 'Add Initiative',//this.l('AddDeliverable'),
                disabled: !canManageDeliverables && (this.selectedOu ? this.selectedOu.data.parentId !== null : true),
                command: () => {
                    this.addDeliverable(
                        this.selectedOu.data.id,
                        this.selectedOu.data.displayName
                    );
                }
            },
            {
                label: 'Generate Status Report',
                command: () => {
                    this.exportToExcel(
                        this.selectedOu.data.id,
                        this.selectedOu.data.parentId
                    );
                }
            }
            // {
            //     label: this.l('Delete'),
            //     disabled: !canManageOrganizationTree,
            //     command: () => {
            //         this.message.confirm(
            //             this.l('OrganizationUnitDeleteWarningMessage', this.selectedOu.data.displayName),
            //             this.l('AreYouSure'),
            //             isConfirmed => {
            //                 if (isConfirmed) {
            //                     this._organizationUnitService.deleteOrganizationUnit(this.selectedOu.data.id).subscribe(() => {
            //                         this.deleteUnit(this.selectedOu.data.id);
            //                         this.notify.success(this.l('SuccessfullyDeleted'));
            //                         this.selectedOu = null;
            //                         this.reload();
            //                     });
            //                 }
            //             }
            //         );
            //     }
            // }
        ];

        // if (this.isEntityHistoryEnabled()) {
        //     items.push({
        //         label: this.l('History'),
        //         disabled: false,
        //         command: (event) => {
        //             this.entityTypeHistoryModal.show({
        //                 entityId: this.selectedOu.data.id.toString(),
        //                 entityTypeFullName: this._entityTypeFullName,
        //                 entityTypeDescription: this.selectedOu.data.displayName
        //             });
        //         }
        //     });
        // }

        return items;
    }

    addUnit(parentId?: number): void {
        this.createOrEditOrganizationUnitModal.show({
            parentId: parentId
        });
    }

    editUnit(): void {
        if (this.selectedOu.data.parentId) {
            this.createOrEditDeliverableModal.show(this.selectedOu.data.parentId, this.selectedOu.data.displayName, this.selectedOu.data.id);
        } else {
            this.createOrEditMdaModal.show({ id: this.selectedOu.data.id, displayName: this.selectedOu.data.displayName });
        }
    }

    addMda(): void {
        this.createOrEditMdaModal.show({ parentId: null });
    }

    addDeliverable(parentId: number, parentName: string): void {
        if (this.selectedOu.data.parentId) {
            this.notify.info(this.l('DeliverablesAddedToMDAsOnlyError'));
            return;
        }
        this.createOrEditDeliverableModal.show(parentId, parentName, null);
    }

    unitCreated(ou: OrganizationUnitDto): void {
        if (ou.parentId) {
            let unit = this._treeDataHelperService.findNode(this.treeData, { data: { id: ou.parentId } });
            if (!unit) {
                return;
            }

            unit.children.push({
                label: ou.displayName,
                expandedIcon: 'fa fa-folder-open m--font-warning',
                collapsedIcon: 'fa fa-folder m--font-warning',
                selected: true,
                children: [],
                data: ou,
                memberCount: ou.memberCount,
                roleCount: ou.roleCount
            });
        } else {
            this.treeData.push({
                label: ou.displayName,
                expandedIcon: 'fa fa-folder-open m--font-warning',
                collapsedIcon: 'fa fa-folder m--font-warning',
                selected: true,
                children: [],
                data: ou,
                memberCount: ou.memberCount,
                roleCount: ou.roleCount
            });
        }

        this.totalUnitCount += 1;
    }

    deleteUnit(id) {
        let node = this._treeDataHelperService.findNode(this.treeData, { data: { id: id } });
        if (!node) {
            return;
        }

        if (!node.data.parentId) {
            _.remove(this.treeData, {
                data: {
                    id: id
                }
            });
        }

        let parentNode = this._treeDataHelperService.findNode(this.treeData, { data: { id: node.data.parentId } });
        if (!parentNode) {
            return;
        }

        _.remove(parentNode.children, {
            data: {
                id: id
            }
        });
    }

    unitUpdated(ou: OrganizationUnitDto): void {
        let item = this._treeDataHelperService.findNode(this.treeData, { data: { id: ou.id } });
        if (!item) {
            return;
        }

        item.data.displayName = ou.displayName;
        item.label = ou.displayName;
        item.memberCount = ou.memberCount;
        item.roleCount = ou.roleCount;
    }

    membersAdded(data: IUsersWithOrganizationUnit): void {
        this.incrementMemberCount(data.ouId, data.userIds.length);
    }

    memberRemoved(data: IUserWithOrganizationUnit): void {
        this.incrementMemberCount(data.ouId, -1);
    }

    incrementMemberCount(ouId: number, incrementAmount: number): void {
        let item = this._treeDataHelperService.findNode(this.treeData, { data: { id: ouId } });
        item.data.memberCount += incrementAmount;
        item.memberCount = item.data.memberCount;
    }

    rolesAdded(data: IRolesWithOrganizationUnit): void {
        this.incrementRoleCount(data.ouId, data.roleIds.length);
    }

    roleRemoved(data: IRoleWithOrganizationUnit): void {
        this.incrementRoleCount(data.ouId, -1);
    }

    incrementRoleCount(ouId: number, incrementAmount: number): void {
        let item = this._treeDataHelperService.findNode(this.treeData, { data: { id: ouId } });
        item.data.roleCount += incrementAmount;
        item.roleCount = item.data.roleCount;
    }

    exportToExcel(ouId: number, parentId?: number): void {
        if (!parentId) {
            this.generatingReport = true;
            this._deliverableServiceProxy.getMdaDeliverablesToExcel(ouId)
                .pipe(finalize(() => this.generatingReport = false))
                .subscribe(result => {
                    this._fileDownloadService.downloadTempFile(result);
                });
        } else {
            this.generatingReport = true;
            this._deliverableServiceProxy.getDeliverableToExcel(ouId)
                .pipe(finalize(() => this.generatingReport = false))
                .subscribe(result => {
                    this._fileDownloadService.downloadTempFile(result);
                });
        }
    }
}
