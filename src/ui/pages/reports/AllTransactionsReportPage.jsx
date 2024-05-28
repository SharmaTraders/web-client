import Button from "@mui/material/Button";
import "./Reports.css";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import {getFormattedBsDateFromAdDate, getBsToday, getBsFromAdDate} from "../../../utils/dateConverters";
import React, {useState} from "react";
import {useGetAllTransactionsReportQuery} from "../../../redux/features/api/reportsApi";
import {StickyHeadTableSkeleton} from "../../components/Item/ItemActivityComponent";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {toast} from "react-toastify";
import jsPDF from "jspdf";
import DownloadIcon from '@mui/icons-material/Download';
import "jspdf-autotable";


function AllTransactionsReportPage() {
    const currentDate = new Date().toISOString().split('T')[0];
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Init with dateFrom to last month,
    const [dateFrom, setDateFrom] = useState(lastMonth);
    const [dateTo, setDateTo] = useState(currentDate);

    const {data, isLoading} = useGetAllTransactionsReportQuery({
        dateFrom,
        dateTo
    });

    const totalMoneyIn = data?.transactions?.filter(transaction => transaction.type.toLowerCase() === "income" || transaction.type.toLowerCase() === "sales")
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalMoneyOut = data?.transactions?.filter(transaction => transaction.type.toLowerCase() === "expense" || transaction.type.toLowerCase() === "purchase")
        .reduce((acc, transaction) => acc + transaction.amount, 0);


    function handleDownloadReport() {
        if (!data || !data.transactions || data.transactions.length === 0) {
            toast.info("No transactions to download.");
            return;
        }

        const doc = new jsPDF();
        const title = `All Transactions Report`;
        const subtitle = `From: ${getFormattedBsDateFromAdDate(dateFrom)}        To: ${getFormattedBsDateFromAdDate(dateTo)}`;

        doc.text(title, 14, 22);
        doc.setFontSize(11);
        doc.text(subtitle, 14, 32);

        const tableColumn = ["Date", "Type", "Category", "Amount", "Remarks"];
        const tableRows = [];

        data.transactions.forEach(transaction => {
            const transactionData = [
                getFormattedBsDateFromAdDate(transaction.date),
                transaction.type,
                transaction.category,
                transaction.amount,
                transaction.remarks || "-"
            ];
            tableRows.push(transactionData);
        });

        // Add totals to the document
        doc.text(`Total money in: Rs. ${totalMoneyIn}`, 14, 42);
        doc.text(`Total money out: Rs. ${totalMoneyOut}`, 14, 50);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 60,
        });

        doc.save(`Transactions_Report_${dateFrom}_to_${dateTo}.pdf`);
    }

    function onFromDateChange({adDate}) {
        setDateFrom(adDate);
    }

    function onToDateChange({adDate}) {
        setDateTo(adDate);
    }



    return <div className={"page"}>
        <div className={"page-header"}>
            <h3>
                All Transactions
            </h3>
            <Button variant="contained"
                    color="primary"
                    startIcon = {<DownloadIcon/>}
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

            <div className={"report-info"}>
                <div className={"primary-color"}>
                    Total money in : {totalMoneyIn ? totalMoneyIn : '0'}
                </div>

                <div className={"error-color"}>
                    Total money out : {totalMoneyOut ? totalMoneyOut: '0'}
                </div>
            </div>
        </div>
        <div className={"transaction-report"}>
            {
                isLoading ?
                    <StickyHeadTableSkeleton count={15}/>
                    :
                    (
                        data  &&
                        <TransactionReportTable data={data}/>
                    )
            }
        </div>
    </div>
}

function TransactionReportTable({data}) {
    const columns = [
        {
            id: 'date',
            label: 'Date'
        },
        {
            id: 'type',
            label: 'Type'
        },
        {
            id: 'category',
            label: 'Category'
        },

        {
            id: 'amount',
            label: 'Amount (Rs)'
        },
        {
            id: 'remarks',
            label: 'Remarks'
        }
    ]

    const rows = data?.transactions || [];
    if (rows.length === 0) return <div className={"center"}>
        No transaction found between provided dates...
    </div>

    return <Paper sx={{width: '100%', overflow: 'hidden', marginTop: '2rem'}}>
        <TableContainer sx={{maxHeight: '95%'}}>
            <Table stickyHeader aria-label="All transactions report">
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
                                    if (column.id === "date") {
                                        return <TableCell key={column.id} align={column.align}>
                                            {getFormattedBsDateFromAdDate(value)}
                                        </TableCell>
                                    }

                                    if (column.id === "type" || column.id === "amount") {
                                        let color = '#00a878';
                                        const redColors = ['expense', 'purchase']
                                        if (redColors.includes(transaction.type.toLowerCase())) {
                                            color = '#e3526e';
                                        }
                                        return <TableCell key={column.id} align={column.align} sx={{color: color}}>
                                            {value}
                                        </TableCell>

                                    }
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

export default AllTransactionsReportPage;
