import moment from "moment";


export const tableController = {
    /**
     * Event - Paginate Page Change
     * @param {*} event 
     */
    onPageChange(event, first ,paginateParams, dispatch, setPaginate) {
        first.current = event.page * paginateParams.per_page;
        console.log(first.current);
        dispatch(
            setPaginate({
                ...paginateParams,
                page: event?.page + 1,
                per_page: event?.rows,
            })
        );
    },
    /**
     * Event - Search
     * @param {*} event 
     */
    onSearchChange(event, paginateParams ,dispatch, setPaginate){
        dispatch(
            setPaginate({
                ...paginateParams,
                search: event,
            })
        );
    },
    /**
     * Event - Column sorting "DESC | ASC"
     * @param {*} event 
     */
    onSort(event, paginateParams, dispatch, setPaginate){
        const sortOrder = event.sortOrder === 1 ? "DESC" : "ASC";
        dispatch(
            setPaginate({
                ...paginateParams,
                sort: sortOrder,
                order: event.sortField
            })
        );
    },
    /**
   * On Change Filter
   * @param {*} e
   */
    onFilter(event, paginateParams, dispatch, setPaginate, setStatusFilter){
        let updatePaginateParams = { ...paginateParams };
    
        if (event === "ALL") {
            updatePaginateParams.filter = "";
            updatePaginateParams.value = "";
        } else {
            updatePaginateParams.filter = "status";
            updatePaginateParams.value = event;
        }
    
        dispatch(setPaginate(updatePaginateParams));
        dispatch(setStatusFilter(event));
    },
    onFilterByDate(event, paginateParams, dispatch, setPaginate, setDateFilter){
        let updatePaginateParams = { ...paginateParams };

        if (event.startDate === "" || event.endDate === "") {
            delete updatePaginateParams.start_date;
            delete updatePaginateParams.end_date;
        } else {
            updatePaginateParams.start_date = moment(event.startDate).format("yy-MM-DD");
            updatePaginateParams.end_date = moment(event.endDate).format("yy-MM-DD");
        }

        dispatch(setDateFilter(event));
        dispatch(setPaginate(updatePaginateParams));
    }
}

