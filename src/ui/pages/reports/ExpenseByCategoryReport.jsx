import React, {useState} from "react";
import {
    useGetExpenseByCategoryReportQuery,
} from "../../../redux/features/api/reportsApi";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import {getBsFromAdDate, getBsToday, getFormattedBsDateFromAdDate} from "../../../utils/dateConverters";
import {StickyHeadTableSkeleton} from "../../components/Item/ItemActivityComponent";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import jsPDF from "jspdf";
import {toast} from "react-toastify";

function ExpenseByCategoryReport(){
    const currentDate = new Date().toISOString().split('T')[0];
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Init with dateFrom to last month,
    const [dateFrom, setDateFrom] = useState(lastMonth);
    const [dateTo, setDateTo] = useState(currentDate);

    const {data, isLoading} = useGetExpenseByCategoryReportQuery({
        dateFrom,
        dateTo
    });

    function onFromDateChange({adDate}) {
        setDateFrom(adDate);
    }

    function onToDateChange({adDate}) {
        setDateTo(adDate);
    }

    function handleDownloadReport(){
        if (!data || !data.expenses || data.expenses.length === 0) {
            toast.info("No expense categories to download.");
            return;
        }

        const doc = new jsPDF();
        const title = `Expense by Category Report`;
        const subtitle = `From: ${getFormattedBsDateFromAdDate(dateFrom)}        To: ${getFormattedBsDateFromAdDate(dateTo)}`;

        doc.text(title, 14, 22);
        doc.setFontSize(11);
        doc.text(subtitle, 14, 32);

        const tableColumn = ["SN", "Category", "Total Expense"];
        const tableRows = [];

        data.expenses.forEach((expense, index) => {
            const expenseData = [
                index + 1,
                expense.category,
                expense.amount
            ];
            tableRows.push(expenseData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 40,
        });

        doc.save(`Expense_By_Category_Report_${dateFrom}_to_${dateTo}.pdf`);

    }

    return <div className={"page"}>
        <div className={"page-header"}>
            <h3>
                Expense by category
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
            id: 'sn',
            label: "SN"
        },
        {
            id: 'category',
            label: 'Category'
        },
        {
            id: 'amount',
            label: 'Total expense'
        }
    ]
    const rows = data?.expenses || [];
    if (rows.length === 0) return <div className={"center"}>
        No expense category found...
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
                        rows.map((expense, index) => {
                            return <TableRow hover role="checkbox" tabIndex={-1} key={expense.id}>
                                {columns.map((column) => {
                                    if (column.id === 'sn') return <TableCell key={column.id} align={column.align}>
                                        {index + 1}
                                    </TableCell>

                                    const value = expense[column.id];
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

export default ExpenseByCategoryReport;