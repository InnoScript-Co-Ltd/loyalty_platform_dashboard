import React, { useMemo } from 'react';
import { Search } from './Search';
import { endpoints } from '../constants/endpoints';
import { FilterByStatus } from './FilterByStatus';
import { FilterByDate } from './FilterByDate';
import { ExportExcel } from './export';
import { useDispatch } from 'react-redux';
import { tableController } from '../helpers/tableController';

const HeaderRender = (
    { 
        translate, 
        paginateParams, 
        setPaginate, 
        userStatus, 
        setStatusFilter, 
        setDateFilter 
    }) => {
    const dispatch = useDispatch();

    const headerContent = useMemo(() => (
        <div className="w-full flex flex-column md:flex-row justify-content-between md:justify-content-start align-items-start md:align-items-center gap-3">
            <Search
                tooltipLabel={paginateParams.columns}
                placeholder={translate.search}
                onSearch={(event) => tableController.onSearchChange(event, paginateParams, dispatch, setPaginate)}
                label={translate.press_enter_key_to_search}
            />

            <div className='flex flex-column md:flex-row align-items-start md:align-items-end justify-content-center gap-3'>
                <FilterByStatus
                    status={userStatus ? userStatus : []}
                    onFilter={(event) => tableController.onFilter(event, paginateParams, dispatch, setPaginate, setStatusFilter)}
                    label={translate.filter_by}
                />

                <FilterByDate
                    onFilter={(event) => tableController.onFilterByDate(event, paginateParams, dispatch, setPaginate, setDateFilter)}
                    label={translate.filter_by_date}
                />

                <ExportExcel
                    url={endpoints.exportUser}
                />
            </div>
        </div>
    ), [dispatch, paginateParams, translate, userStatus]);

    return headerContent;
};

export default HeaderRender;
