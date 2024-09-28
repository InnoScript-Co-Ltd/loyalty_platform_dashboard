import React, { useMemo } from 'react';
import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux';
import { PaginatorRight } from './PaginatorRight';
import { setPaginate } from '../modules/admin/adminSlice';
import { setDateFilter, setStatusFilter } from './shareSlice';

const FooterRender = (
    { 
        total, 
        translate, 
        showAuditColumn, 
        setShowAuditColumn, 
        payload 
    }) => {
    const dispatch = useDispatch();

    const footerContent = useMemo(() => (
        <div className='flex items-center justify-content-between'>
            <div>{translate.total} - <span style={{ color: "#4338CA" }}>{total > 0 ? total : 0}</span></div>
            <div className='flex align-items-center gap-3'>
                <Button
                    outlined
                    icon="pi pi-refresh"
                    size="small"
                    onClick={() => {
                        dispatch(setPaginate(payload.paginateParams));
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
    ), [dispatch, translate, total]);

    return footerContent;
};

export default FooterRender;
