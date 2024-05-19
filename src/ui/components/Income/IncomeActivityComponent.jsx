import {useSelector} from "react-redux";
import {selectSelectedBillingParty} from "../../../redux/features/state/billingPartyState";
import React, {useState} from "react";
import {useGetIncomesByBillingPartyQuery} from "../../../redux/features/api/income";
import {StickyHeadTableSkeleton} from "../Item/ItemActivityComponent";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

function IncomeActivityComponent() {
    const selectedBillingParty = useSelector(selectSelectedBillingParty);
    if (!selectedBillingParty) return <div> Please select a billing party to view income activity</div>

    return <div className={"item-activity"}>
        <div className={"item-activity-headers"}>
            <div className={"bold"}>
                Activity
            </div>
            <div className={"item-activity-buttons"}>
                {/* Button */}
            </div>

        </div>

        <div className={"item-activity-content"}>

        </div>

    </div>
}

function StickyHeadIncomeTable({billingPartyId}) {
    const [pageNumber, setPageNumber] = useState(1);
    const rowsPerPage = 8;

    const {data, isLoading} = useGetIncomesByBillingPartyQuery({
        billingPartyId,
        pageNumber,
        pageSize: rowsPerPage
    });

    if (isLoading) return <StickyHeadTableSkeleton count={6}/>

    function handlePageChange(event, newPage) {
        setPageNumber(newPage + 1);
    }

    const columns = [
        {
            id: 'date',
            label: 'Date'
        },
        {
            id: 'amount',
            label: 'Amount'
        },
        {
            id: 'remarks',
            label: 'Remarks'
        }
    ]

    const row = data?.incomes || [];
    if (row.length === 0) return <div>
        No income records for the party yet..
    </div>

    return <Paper sx={{width: '100%', overflow: 'hidden'}}>
        <TableContainer sx={{maxHeight: '85%'}}>
            <Table stickyHeader aria-label="All incomes by party">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align}
                                style={{
                                    minWidth: column.minWidth,
                                    fontWeight: 'bold',
                                }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>

                </TableBody>
            </Table>

        </TableContainer>
    </Paper>

}