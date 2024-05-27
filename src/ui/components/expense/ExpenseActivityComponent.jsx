import {selectSelectedCategory} from "../../../redux/features/state/expenseCategoryState";
import {useSelector} from "react-redux";
import React, {useState} from "react";
import {useGetExpenseByCategoryQuery} from "../../../redux/features/api/expenseApi";
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

function ExpenseActivityComponent() {
    const selectedCategory = useSelector(selectSelectedCategory)

    return <div className={"item-activity"}>
        <div className={"item-activity-headers"}>
            <div className={"bold"}>
                Expense Activity
            </div>
            <div className={"item-activity-buttons"}>
                {/* Button */}
            </div>
        </div>
        <div className={"item-activity-content"}>
            {
                selectedCategory ?
                    <StickyHeadExpenseTable category={selectedCategory}/>
                    :
                    <div className={"center"}> Please select a category to view expense activity</div>
            }
        </div>
    </div>

}


function StickyHeadExpenseTable({category}) {
    const [pageNumber, setPageNumber] = useState(1);
    const rowsPerPage = 8;

    const {data, isLoading} = useGetExpenseByCategoryQuery({
        categoryName: category,
        pageNumber,
        pageSize: rowsPerPage
    });

    if (isLoading) return <StickyHeadTableSkeleton count={6}/>

    function handlePageChange(event, newPage) {
        setPageNumber(newPage + 1);
    }

    const columns = [{
        id: 'date',
        label: 'Date',
    },
        {
            id: 'amount',
            label: 'Amount',
        }, {
            id: 'remarks',
            label: 'Remarks',

        }];

    console.log(data);
    const rows = data?.expenses || [];
    if (rows.length === 0) {
        if (pageNumber !== 1) setPageNumber(1);
        return <div className={"center"}>
            No expense records for the category yet..
        </div>
    }

    return <Paper sx={{width: '100%', overflow: 'hidden'}}>
        <TableContainer sx={{maxHeight: '85%'}}>
            <Table stickyHeader aria-label="All expenses by category">
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
                    {
                        rows.map(expense => {
                            return <TableRow hover role="checkbox" tabIndex={-1} key={expense.id}>
                                {columns.map((column) => {
                                    const value = expense[column.id];
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

function ExpenseTableModal({open, handleClose}) {
    const selectedCategory = useSelector(selectSelectedCategory);
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
                    selectedCategory ?
                        <StickyHeadExpenseTable category={selectedCategory}/>
                        :
                        <div style={{padding: '1rem'}}> Please select a billing party to view income activity</div>
                }
            </Box>
        </Fade>
    </Modal>

}


export default ExpenseActivityComponent;
export {ExpenseTableModal};