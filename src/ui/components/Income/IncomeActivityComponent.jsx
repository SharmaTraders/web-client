import {useSelector} from "react-redux";
import {selectSelectedBillingParty} from "../../../redux/features/state/billingPartyState";
import React, {useState} from "react";
import {useGetIncomesByBillingPartyQuery} from "../../../redux/features/api/incomeApi";
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

function IncomeActivityComponent() {
    const selectedBillingParty = useSelector(selectSelectedBillingParty);

    return <div className={"item-activity"}>
        <div className={"item-activity-headers"}>
            <div className={"bold"}>
                Income Activity
            </div>
            <div className={"item-activity-buttons"}>
                {/* Button */}
            </div>

        </div>

        <div className={"item-activity-content"}>
            {
                selectedBillingParty ?
                    <StickyHeadIncomeTable billingPartyId={selectedBillingParty.id}/>
                    :
                    <div className={"center"}> Please select a billing party to view income activity</div>
            }
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

    const rows = data?.incomes || [];
    if (rows.length === 0) return <div className={"center"}>
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
                        rows.map(income => {
                            return <TableRow hover role="checkbox" tabIndex={-1} key={income.id}>
                                {columns.map((column) => {
                                    const value = income[column.id];
                                    if (column.id === "date") {
                                        return <TableCell key={column.id} align={column.align}>
                                            {getFormattedBsDateFromAdDate(value)}
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
            labelRowsPerPage=''
            rowsPerPageOptions={[]}
            component="div"
            count={data.totalCount}
            page={pageNumber - 1}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
        />

    </Paper>
}

function IncomesTableModal({open, handleClose}) {
    const selectedBillingParty = useSelector(selectSelectedBillingParty);
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
        <Fade in={open}>
            <Box sx={style}>
                {
                    selectedBillingParty ?
                        <StickyHeadIncomeTable billingPartyId={selectedBillingParty.id}/>
                        :
                        <div style={{padding: '1rem'}}> Please select a billing party to view income activity</div>
                }
            </Box>
        </Fade>
    </Modal>

}

export default IncomeActivityComponent;
export {IncomesTableModal, StickyHeadTableSkeleton};