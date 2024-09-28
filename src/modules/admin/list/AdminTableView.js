import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminPayload } from "../adminPayload";
import { auditColumns, paginateOptions } from "../../../constants/config";
import { adminService } from "../adminService";
import { datetime } from "../../../helpers/datetime";
import { Status } from "../../../shares/Status";
import { paths } from "../../../constants/paths";
import { Paginator } from "primereact/paginator";
import { setPaginate } from "../adminSlice";
import { Card } from "primereact/card";
import { getRequest } from "../../../helpers/api";
import { endpoints } from "../../../constants/endpoints";
import { setDateFilter, setStatusFilter } from "../../../shares/shareSlice";
import { NavigateId } from "../../../shares/NavigateId";
import { tableController } from "../../../helpers/tableController";
import HeaderRender from "../../../shares/TableHeader";
import FooterRender from "../../../shares/TableFooter";

export const AdminTableView = () => {
  const dispatch = useDispatch();
  const { admins, paginateParams } = useSelector((state) => state.admin);
  const { translate } = useSelector(state => state.setting);

  const [loading, setLoading] = useState(false);
  const [showAuditColumn, setShowAuditColumn] = useState(false);

  const columns = useRef(adminPayload.columns);
  const showColumns = useRef(
    columns.current.filter((col) => col.show === true)
  );
  const total = useRef(0);
  const first = useRef(0);
  const adminStatus = useRef(["ALL"]);

  /**
   *  Loading Data
   */
  const loadingData = useCallback(async () => {
    setLoading(true);

    const result = await adminService.index(dispatch, paginateParams);
    if (result.status === 200) {
      total.current = result.data.total
        ? result.data.total
        : result.data.length;
    }
    setLoading(false);
  }, [dispatch, paginateParams]);

  /**
   * Loading Admin Status
   */
  const loadingStatus = useCallback(async () => {
    const adminStatusResponse = await getRequest(
      `${endpoints.status}?type=admin`
    );

    if (adminStatusResponse.status === 200) {
      adminStatus.current = adminStatus.current.concat(
        adminStatusResponse.data.admin
      );
    }
  }, []);

  useEffect(() => {
    loadingStatus();
  }, [loadingStatus]);

  useEffect(() => {
    loadingData();
  }, [loadingData]);

  return (
    <Card title={translate.admin_list}>
      <DataTable
        dataKey="id"
        size="normal"
        value={admins}
        sortField={paginateParams.order}
        sortOrder={
          paginateParams.sort === "DESC"
            ? 1
            : paginateParams.sort === "ASC"
              ? -1
              : 0
        }
        onSort={(event) => tableController.onSort(event, paginateParams, dispatch, setPaginate)}
        lazy={paginateOptions.lazy}
        loading={loading}
        resizableColumns={paginateOptions.resizableColumns}
        emptyMessage="No admin accounts found."
        globalFilterFields={adminPayload.columns}
        header={
        <HeaderRender 
          translate={translate} 
          paginateParams={paginateParams} 
          setPaginate={setPaginate} 
          userStatus={adminStatus.current}
          setDateFilter={setDateFilter}
          setStatusFilter={setStatusFilter}
          />
        }
        footer={
          <FooterRender 
          total={total.current}
          translate={translate}
          showAuditColumn={showAuditColumn}
          setShowAuditColumn={setShowAuditColumn}
          payload={adminPayload}
          />
        }
      >
        {showColumns.current.map((col, index) => {
          return (
            <Column
              key={`admin_col_index_${index}`}
              style={{ minWidth: "250px" }}
              field={col.field}
              header={col.header}
              sortable
              body={(value) => {
                switch (col.field) {
                  case "id":
                    return (
                      <NavigateId
                        url={`${paths.admin}/${value[col.field]}`}
                        value={value[col.field]}
                      />
                    );
                  case "status":
                    return <Status status={value[col.field]} />;
                  default:
                    return value[col.field];
                }
              }}
            />
          );
        })}

        {showAuditColumn &&
          auditColumns.map((col, index) => {
            return (
              <Column
                key={`audit_column_key_${index}`}
                style={{ minWidth: "250px" }}
                field={col.field}
                header={col.header}
                sortable
                body={(value) => {
                  if (
                    col.field === "created_at" ||
                    col.field === "updated_at" ||
                    col.field === "deleted_at"
                  ) {
                    return <label> {datetime.long(value[col.field])} </label>;
                  } else {
                    return (
                      <label>
                        {" "}
                        {value[col.field] && value[col.field].name}{" "}
                      </label>
                    );
                  }
                }}
              />
            );
          })}
      </DataTable>
      <Paginator
        first={first.current}
        rows={paginateParams.per_page}
        totalRecords={total?.current ? total.current : 0}
        rowsPerPageOptions={paginateOptions?.rowsPerPageOptions}
        template={
          "FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
        }
        currentPageReportTemplate="Total - {totalRecords} | {currentPage} of {totalPages}"
        onPageChange={(event) => tableController.onPageChange(event, first ,paginateParams, dispatch, setPaginate)}
      />
    </Card>
  );
};
