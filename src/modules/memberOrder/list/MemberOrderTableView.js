

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { auditColumns, paginateOptions } from '../../../constants/config';
import { Search } from '../../../shares/Search';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { PaginatorRight } from '../../../shares/PaginatorRight';
import { Column } from 'primereact/column';
import { Status } from '../../../shares/Status';
import { datetime } from '../../../helpers/datetime';
import { paths } from '../../../constants/paths';
import { Paginator } from 'primereact/paginator';
import { setDateFilter, setStatusFilter } from '../../../shares/shareSlice';
import { FilterByStatus } from '../../../shares/FilterByStatus';
import moment from 'moment';
import { FilterByDate } from '../../../shares/FilterByDate';
import { Card } from 'primereact/card';
import { NavigateId } from '../../../shares/NavigateId';
import { memberOrderPayload } from '../memberOrderPayload';
import { setPaginate } from '../memberOrderSlice';
import { memberOrderService } from '../memberOrderService';
import { getRequest } from '../../../helpers/api';
import { endpoints } from '../../../constants/endpoints';

export const MemberOrderTableView = () => {


    const dispatch = useDispatch();
    const { memberOrders, paginateParams } = useSelector(state => state.memberOrder);
    const { translate } = useSelector(state => state.setting);

    const [loading, setLoading] = useState(false);
    const [showAuditColumn, setShowAuditColumn] = useState(false);

    const total = useRef(0);
    const first = useRef(0);
    const memberOrderStatus = useRef(["ALL"]);
    const columns = useRef(memberOrderPayload?.columns);
    const showColumns = useRef(columns?.current?.filter(col => col.show === true));

    /**
     * Event - Paginate Page Change
     * @param {*} event 
     */
    const onPageChange = (event) => {
        first.current = event.page * paginateParams.per_page;
        dispatch(
            setPaginate({
                ...paginateParams,
                page: event?.page + 1,
                per_page: event?.rows,
            })
        );
    };

    /**
     * Event - Search
     * @param {*} event 
     */
    const onSearchChange = (event) => {
        dispatch(
            setPaginate({
                ...paginateParams,
                search: event,
            })
        );
    };

    /**
     * Event - Column sorting "DESC | ASC"
     * @param {*} event 
     */
    const onSort = (event) => {
        const sortOrder = event.sortOrder === 1 ? "DESC" : "ASC";
        console.log(event);
        dispatch(
            setPaginate({
                ...paginateParams,
                sort: sortOrder,
                order: event.sortField
            })
        );
    }

    /**
  * On Change Filter
  * @param {*} e
  */
    const onFilter = (e) => {
        let updatePaginateParams = { ...paginateParams };

        if (e === "ALL") {
            updatePaginateParams.filter = "";
            updatePaginateParams.value = "";
        } else {
            updatePaginateParams.filter = "status";
            updatePaginateParams.value = e;
        }

        dispatch(setPaginate(updatePaginateParams));
        dispatch(setStatusFilter(e));
    };

    const onFilterByDate = (e) => {
        let updatePaginateParams = { ...paginateParams };

        if (e.startDate === "" || e.endDate === "") {
            delete updatePaginateParams.start_date;
            delete updatePaginateParams.end_date;
        } else {
            updatePaginateParams.start_date = moment(e.startDate).format("yy-MM-DD");
            updatePaginateParams.end_date = moment(e.endDate).format("yy-MM-DD");
        }

        dispatch(setDateFilter(e));
        dispatch(setPaginate(updatePaginateParams));
    };

    /**
     *  Loading Data
     */
    const loadingData = useCallback(async () => {
        setLoading(true);
        const result = await memberOrderService.index(dispatch, paginateParams);
        if (result.status === 200) {
            total.current = result?.data?.total ? result.data.total : result.data.length;
        }

        setLoading(false);
    }, [dispatch, paginateParams]);

    /**
     * loading member Order Status
    */
    const loadingStatus = useCallback(async () => {
        const memberOrderStatusResponse = await getRequest(
            `${endpoints.status}?type=memberOrder`
        );

        if (memberOrderStatusResponse.status === 200) {
            memberOrderStatus.current = memberOrderStatus.current.concat(
                memberOrderStatusResponse.data.memberOrder
            );
        }
    }, []);

    useEffect(() => {
        loadingStatus();
    }, [loadingStatus]);

    useEffect(() => {
        loadingData();
    }, [loadingData])

    /**
     * Table Footer Render
     * **/
    const FooterRender = () => {
        return (
            <div className=' flex items-center justify-content-between'>
                <div>{translate.total} - <span style={{ color: "#4338CA" }}> {total.current > 0 ? total.current : 0}</span></div>
                <div className=' flex align-items-center gap-3'>
                    <Button
                        outlined
                        icon="pi pi-refresh"
                        size="small"
                        onClick={() => {
                            dispatch(setPaginate(memberOrderPayload.paginateParams));
                            dispatch(setStatusFilter("ALL"));
                            dispatch(setDateFilter({ startDate: "", endDate: "" }));
                        }}
                    />
                    <PaginatorRight
                        show={showAuditColumn}
                        onHandler={(e) => setShowAuditColumn(e)}
                        label={translate.audit_columns}
                    />
                </div>
            </div>
        )
    }

    /**
    * Table Header Render
    */
    const HeaderRender = () => {
        return (
            <div className="w-full flex flex-column md:flex-row justify-content-between md:justify-content-start align-items-start md:align-items-center gap-3">
                <Search
                    tooltipLabel={memberOrderPayload.paginateParams.columns}
                    placeholder={translate.search}
                    onSearch={(e) => onSearchChange(e)}
                    label={translate.press_enter_key_to_search}
                />

                <div className="flex flex-column md:flex-row align-items-start md:align-items-end justify-content-center gap-3">
                    <FilterByStatus
                        status={memberOrderStatus.current}
                        onFilter={(e) => onFilter(e)}
                        label={translate.filter_by}
                    />

                    <FilterByDate
                        onFilter={(e) => onFilterByDate(e)}
                        label={translate.filter_by_date}
                    />
                </div>
            </div>
        )
    }


    return (
        <Card
            title={translate.member_order_list}
        >
            <DataTable
                dataKey="id"
                size="normal"
                value={memberOrders}
                sortField={paginateParams.order}
                sortOrder={paginateParams.sort === 'DESC' ? 1 : paginateParams.sort === 'ASC' ? -1 : 0}
                onSort={onSort}
                sortMode={paginateOptions.sortMode}
                loading={loading}
                emptyMessage="No order found."
                globalFilterFields={memberOrderPayload.columns}
                header={<HeaderRender />}
                footer={<FooterRender />}
            >
                {showColumns && showColumns.current?.map((col, index) => {
                    return (
                        <Column
                            key={`user_col_index_${index}`}
                            style={{ minWidth: `${col.width}px` }}
                            field={col.field}
                            header={col.header}
                            sortable={col.sortable}
                            body={(value) => {
                                switch (col.field) {
                                    case "order_number":
                                        return (
                                            <NavigateId
                                                url={`${paths.memberOrder}/${value['id']}`}
                                                value={value[col.field]}
                                            />
                                        );
                                    case "amount":
                                        return <span> {value[col.field].toLocaleString()} Ks </span>
                                    case "pay_amount":
                                        return <span> {value[col.field].toLocaleString()} Ks </span>
                                    case "discount":
                                        return <span> - {value[col.field].toLocaleString()} Ks </span>
                                    case "status":
                                        return <Status status={value[col.field]} />;
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
                                    return <label> {datetime.long(value[col.field])} </label>
                                } else {
                                    return <label> {value[col.field] && value[col.field].name} </label>
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
                onPageChange={onPageChange}
            />
        </Card>
    )
}