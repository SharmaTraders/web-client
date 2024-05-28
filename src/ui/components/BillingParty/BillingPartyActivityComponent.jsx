import {useSelector} from "react-redux";
import {selectSelectedBillingParty} from "../../../redux/features/state/billingPartyState";
import React, {useState} from "react";
import {useGetAllPartyTransactionQuery} from "../../../redux/features/api/billingPartyApi";
import {StickyHeadTableSkeleton} from "../Item/ItemActivityComponent";
import {
    Fade,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import {getFormattedBsDateFromAdDate} from "../../../utils/dateConverters";
import Box from "@mui/material/Box";

function BillingPartyActivityComponent(){
    const selectedBillingParty = useSelector(selectSelectedBillingParty);
    if(!selectedBillingParty) return <div className={"center"}> Please select a billing party to view activity</div>

    return <div className={"item-activity"}>
        <div className={"item-activity-headers"}>
            <div className={"bold"}>
                Party Transactions
            </div>
        </div>

        <div className={"item-activity-content"}>
            <StickyHeadPartyTransactionsTable billingPartyId={selectedBillingParty.id}/>
        </div>

    </div>
}

function StickyHeadPartyTransactionsTable({ billingPartyId}) {
    const [pageNumber, setPageNumber] = useState(1);
    const rowsPerPage = 8;

    const {data, isLoading} = useGetAllPartyTransactionQuery({
        billingPartyId,
        pageNumber,
        pageSize: rowsPerPage
    });

    if (isLoading) return <StickyHeadTableSkeleton count={6}/>

    function handlePageChange(event, newPage) {
        setPageNumber(newPage +1);
    }

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
    if (rows.length === 0) {
        if (pageNumber !== 1) setPageNumber(1);
        return <div className={"center"}>
            No transaction found for the party
        </div>
    }

    return <Paper sx={{width: '100%', overflow: 'hidden'}}>
        <TableContainer sx={{maxHeight: '85%'}}>
            <Table stickyHeader aria-label="Transaction by party">
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
        <TablePagination
            labelRowsPerPage = ''
            rowsPerPageOptions = {[]}
            component="div"
            count={data.totalCount}
            page={pageNumber-1}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}/>
    </Paper>
}

function BillingPartyTransactionsTableModal({open, handleClose}){
    const selectedParty = useSelector(selectSelectedBillingParty);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };


    return <Modal open={open}
                  onClose={handleClose}
                  closeAfterTransition>
        <Fade in = {open}>
            <Box sx ={style}>
                <StickyHeadPartyTransactionsTable billingPartyId={selectedParty.id}/>
            </Box>
        </Fade>
    </Modal>

}

export default BillingPartyActivityComponent;
export {BillingPartyTransactionsTableModal}