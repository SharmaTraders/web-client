import React, {useState} from "react";
import Skeleton from "@mui/material/Skeleton";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import {getBsDateFromAdDate} from "../../../utils/dateConverters";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRupeeSign} from "@fortawesome/free-solid-svg-icons/faRupeeSign";
import {useGetPurchasesQuery} from "../../../redux/features/api/purchaseApi";
import {useGetSaleQuery} from "../../../redux/features/api/saleApi";

function InvoiceActivityComponent({mode}) {
    const [pageNumber, setPageNumber] = useState(1);
    const isMobile = window.innerWidth < 600;

    const rowsPerPage = isMobile ? 8 : 12;

    const saleQuery = useGetSaleQuery({
        pageNumber,
        pageSize: rowsPerPage,
    });

    const purchaseQuery = useGetPurchasesQuery({
        pageNumber,
        pageSize: rowsPerPage,
    });

    const {data, isLoading} = mode === "purchase" ? purchaseQuery : saleQuery;

    if (isLoading) return <StickyHeadTableSkeleton count={6}/>;
    if (!data) return;

    function handlePageChange(event, newPage) {
        setPageNumber(newPage + 1);
    }

    const columns = [
        {
            id: "partyName",
            label: "Party Name",
            minWidth: 170,
        },
        {
            id: "invoiceNo",
            label: "Invoice No",
            minWidth: 100,
        },
        {
            id: "date",
            label: "Date",
            minWidth: 170,
            align: "center",
        },
        {
            id: "totalAmount",
            label: "Total Amount",
            minWidth: 170,
            align: "center",
        },
        {
            id: "remainingBalance",
            label: "Remaining Amount",
            minWidth: 170,
            align: "center",
        },
        {
            id: "remarks",
            label: "Remark",
            minWidth: 170,
            align: "center",
        }
    ];

    const rows = mode === "purchase" ? data.purchases : data.sales;

    if (rows.length === 0) return <div>No invoice record yet</div>;

    return (
        <Paper sx={{width: "100%", overflow: "hidden"}}>
            <TableContainer sx={{maxHeight: "85%"}}>
                <Table stickyHeader aria-label="All item invoices">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        minWidth: column.minWidth,
                                        fontWeight: "bold",
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((invoice) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={invoice.id}>
                                    {columns.map((column) => {
                                        const value = invoice[column.id];
                                        if (column.id === "date") {
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {getBsDateFromAdDate(value)}
                                                </TableCell>
                                            );
                                        }

                                        if (column.id === "totalAmount" || column.id === "remainingBalance") {
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    <FontAwesomeIcon icon={faRupeeSign} /> {value.toFixed(2)}
                                                </TableCell>
                                            );
                                        }

                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {value || "-"}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                labelRowsPerPage=""
                rowsPerPageOptions={[]}
                component="div"
                count={data.totalCount}
                page={pageNumber - 1}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
            />
        </Paper>
    );
}

function StickyHeadTableSkeleton({ count }) {
    function TableRow() {
        return (
            <div className={"table-row"}>
                <div className={"table-text"}>
                    <Skeleton animation="wave" variant="rectangular" width={40} height={10} />
                </div>
                <div className={"table-text"}>
                    <Skeleton animation="wave" variant="rectangular" width={40} height={10} />
                </div>
                <div className={"table-text"}>
                    <Skeleton animation="wave" variant="rectangular" width={40} height={10} />
                </div>
                <div className={"table-text"}>
                    <Skeleton animation="wave" variant="rectangular" width={40} height={10} />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={"table-content"}>
                {Array.from({ length: count }).map((_, index) => {
                    return <TableRow key={index} />;
                })}
            </div>
        </>
    );
}
InvoiceActivityComponent.propTypes = {
    mode: PropTypes.oneOf(['sale', 'purchase']).isRequired,
};

export { InvoiceActivityComponent, StickyHeadTableSkeleton };
