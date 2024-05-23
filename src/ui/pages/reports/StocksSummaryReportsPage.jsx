import React, {useState} from "react";
import {useGetStocksSummaryReportQuery} from "../../../redux/features/api/reportsApi";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import {getBsFromAdDate, getBsToday, getFormattedBsDateFromAdDate} from "../../../utils/dateConverters";
import {StickyHeadTableSkeleton} from "../../components/Item/ItemActivityComponent";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import jsPDF from "jspdf";
import {toast} from "react-toastify";

function StocksSummaryReportsPage() {
    const currentDate = new Date().toISOString().split('T')[0];
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Init with dateFrom to last month,
    const [dateFrom, setDateFrom] = useState(lastMonth);
    const [dateTo, setDateTo] = useState(currentDate);

    const {data, isLoading} = useGetStocksSummaryReportQuery({
        dateFrom,
        dateTo
    });

    function onFromDateChange({adDate}) {
        setDateFrom(adDate);
    }

    function onToDateChange({adDate}) {
        setDateTo(adDate);
    }


    function handleDownloadReport() {
        if (!data || !data.stockSummary || data.stockSummary.length === 0) {
            toast.info("No stock summary to download.");
            return;
        }

        const doc = new jsPDF();
        const title = `Stocks Summary Report`;
        const subtitle = `From: ${getFormattedBsDateFromAdDate(dateFrom)}        To: ${getFormattedBsDateFromAdDate(dateTo)}`;

        doc.text(title, 14, 22);
        doc.setFontSize(11);
        doc.text(subtitle, 14, 32);

        const tableColumn = ["Item", "Average Sale Price", "Average Purchase Price", "Current Stock", "Stock Value (per kg)"];
        const tableRows = [];

        data.stockSummary.forEach(stock => {
            const stockData = [
                stock.itemName,
                stock.averageSalePrice,
                stock.averagePurchasePrice,
                stock.stockAmount,
                stock.stockValue
            ];
            tableRows.push(stockData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 40,
        });

        doc.save(`Stocks_Summary_Report_${dateFrom}_to_${dateTo}.pdf`);
    }

    return <div className={"page"}>
        <div className={"page-header"}>
            <h3>
                Stocks Summary
            </h3>
            <Button variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon/>}
                    onClick={handleDownloadReport}>
                Download Report
            </Button>
        </div>

        <div className={"transaction-report-top"}>
            <div className={"transaction-filters"}>
                <div className={"filter"}>
                    <div className={"filter-inside"}>
                        <div>From :</div>
                        <div>To :</div>
                    </div>
                    <div className={"filter-inside"}>
                        <Calendar className={"calendar-select"}
                                  theme="green"
                                  defaultDate={getBsFromAdDate(lastMonth)}
                                  language="en"
                                  maxDate={getBsFromAdDate(dateTo)}
                                  onChange={onFromDateChange}
                        />
                        <Calendar className={"calendar-select"}
                                  theme="green"
                                  language="en"
                                  minDate={getBsFromAdDate(dateFrom)}
                                  maxDate={getBsToday()}
                                  onChange={onToDateChange}
                        />
                    </div>
                </div>
            </div>
        </div>
        <div className={"transaction-report"}>
            {
                isLoading ?
                    <StickyHeadTableSkeleton count={15}/>
                    :
                    (
                        data &&
                        <ReportTable data={data} dateFrom={dateFrom} dateTo={dateTo}/>
                    )
            }
        </div>
    </div>
}

function ReportTable({data}){
    const columns = [
        {
            id: 'itemName',
            label: 'Item'
        },
        {
            id: 'averageSalePrice',
            label: 'Average Sale Price'
        },
        {
            id: 'averagePurchasePrice',
            label: 'Average Purchase Price'
        },
        {
            id: 'stockAmount',
            label: 'Current stock (kg)'
        },
        {
            id: 'stockValue',
            label: 'Stock Value (per kg)'
        }
    ];

    const rows = data?.stockSummary || [];
    if (rows.length === 0) return <div className={"center"}>
        No data found between provided dates...
    </div>

    return <Paper sx={{width: '100%', overflow: 'hidden', marginTop: '2rem'}}>
        <TableContainer sx={{maxHeight: '95%'}}>
            <Table stickyHeader aria-label="Stock summary report">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                style={{
                                    fontWeight: 'bold',
                                }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        rows.map(transaction => {
                            return <TableRow hover role="checkbox" tabIndex={-1} key={transaction.id}>
                                {columns.map((column) => {
                                    const value = transaction[column.id];
                                    return <TableCell key={column.id} align={column.align}>
                                        {value || '-'}
                                    </TableCell>
                                })
                                }
                            </TableRow>
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
}

export default StocksSummaryReportsPage;