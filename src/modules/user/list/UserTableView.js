

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userPayload } from '../userPayload';
import { userService } from '../userService';
import { auditColumns, paginateOptions } from '../../../constants/config';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Status } from '../../../shares/Status';
import { dateAge, dateFormat, datetime } from '../../../helpers/datetime';
import { paths } from '../../../constants/paths';
import { Paginator } from 'primereact/paginator';
import { setPaginate } from '../userSlice';
import { setDateFilter, setStatusFilter } from '../../../shares/shareSlice';
import { getRequest } from '../../../helpers/api';
import { endpoints } from '../../../constants/endpoints';
import { Card } from 'primereact/card';
import { NavigateId } from '../../../shares/NavigateId';

import { tableController } from '../../../helpers/tableController';
import HeaderRender from '../../../shares/TableHeader';
import FooterRender from '../../../shares/TableFooter';

export const UserTableView = () => {

    const dispatch = useDispatch();
    const { users, paginateParams } = useSelector(state => state.user);
    const { translate } = useSelector(state => state.setting);

    const [loading, setLoading] = useState(false);
    const [showAuditColumn, setShowAuditColumn] = useState(false);

    const first = useRef(0);
    const total = useRef(0);
    const userStatus = useRef(['ALL']);
    const columns = useRef(userPayload?.columns);
    const showColumns = useRef(columns?.current?.filter(col => col.show === true));

    /**
     *  Loading Data
     */
    const loadingData = useCallback(async () => {
        setLoading(true);
        const result = await userService.index(dispatch, paginateParams);
        if (result.status === 200) {
            total.current = result?.data?.total ? result.data.total : result.data.length;
        }

        setLoading(false);
    }, [dispatch, paginateParams]);

    /**
     * loading User Status
    */
    const loadingStatus = useCallback(async () => {
        const userStatusResponse = await getRequest(
            `${endpoints.status}?type=user`
        );

        if (userStatusResponse.status === 200) {
            userStatus.current = userStatus.current.concat(
                userStatusResponse.data.user
            );
        }
    }, []);

    useEffect(() => {
        loadingStatus();
    }, [loadingStatus]);

    useEffect(() => {
        loadingData();
    }, [loadingData])


    return (
        <Card
            title={translate.user_list}
        >
            <DataTable
                dataKey="id"
                size="normal"
                value={users}

                sortField={paginateParams.order}
                sortOrder={paginateParams.sort === 'DESC' ? 1 : paginateParams.sort === 'ASC' ? -1 : 0}
                onSort={(event) => tableController.onSort(event, paginateParams, dispatch, setPaginate)}
                sortMode={paginateOptions.sortMode}
                loading={loading}
                emptyMessage="No user accounts found."
                globalFilterFields={userPayload.columns}
                header={
                    <HeaderRender 
                      translate={translate} 
                      paginateParams={paginateParams} 
                      setPaginate={setPaginate} 
                      userStatus={userStatus.current}
                      setDateFilter={setDateFilter}
                      setStatusFilter={setStatusFilter}
                      />
                    }
                    footer={
                      <FooterRender
                      total={total}
                      translate={translate}
                      showAuditColumn={showAuditColumn}
                      setShowAuditColumn={setShowAuditColumn}
                      payload={userPayload}
                      />
                    }
            >
                {showColumns && showColumns.current?.map((col, index) => {
                    return (
                        <Column
                            key={`user_col_index_${index}`}
                            style={{ minWidth: col.with }}
                            field={col.field}
                            header={col.header}
                            sortable={col.sortable}
                            body={(value) => {

                                switch (col.field) {
                                    case "name":
                                        return (
                                            <NavigateId
                                                url={`${paths.user}/${value['id']}`}
                                                value={value[col.field]}
                                            />
                                        );
                                    case 'dob':
                                        return <span> {dateFormat(value[col.field], "DEFAULT")} </span>
                                    case 'age':
                                        const userAge = dateAge(value['dob']);
                                        return <span> {userAge.age} {userAge.unit} </span>
                                    case "status":
                                        return <Status status={value[col.field]} />;
                                    case "email_verified_at":
                                        return <span>{datetime.long(value[col.field])}</span>
                                    default:
                                        return value[col.field];
                                }
                            }}
                        />
                    )
                })}

                {showAuditColumn && auditColumns?.map((col, index) => {
                    return (
                        <Column
                            key={`audit_column_key_${index}`}
                            style={{ minWidth: "250px" }}
                            field={col.field}
                            header={col.header}
                            sortable
                            body={(value) => {
                                if (col.field === 'created_at' || col.field === 'updated_at' || col.field === 'deleted_at') {
                                    return <span> {datetime.long(value[col.field])} </span>
                                } else {
                                    return <span> {value[col.field] && value[col.field].name} </span>
                                }
                            }}
                        />
                    )
                })}
            </DataTable>
            <Paginator
                first={first.current}
                rows={paginateParams.per_page}
                totalRecords={total?.current ? total.current : 0}
                rowsPerPageOptions={paginateOptions?.rowsPerPageOptions}
                template={"FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"}
                currentPageReportTemplate="Total - {totalRecords} | {currentPage} of {totalPages}"
                onPageChange={(event) => {
                    tableController.onPageChange(event, first ,paginateParams, dispatch, setPaginate)
                }}
            />
        </Card>
    )
}