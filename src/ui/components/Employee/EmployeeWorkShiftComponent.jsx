import {selectSelectedEmployee} from "../../../redux/features/state/employeeState";
import {useSelector} from "react-redux";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import React, {useState} from "react";
import RegisterEmployeeWorkShift from "./RegisterEmployeeWorkShift";
import {useGetEmployeeWorkShiftsQuery} from "../../../redux/features/api/employeeWorkShift";
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

function EmployeeWorkShiftComponent() {
    const [openModal, setOpenModal] = useState(false);

    function handleClose() {
        setOpenModal(false);
    }

    function handleOpen() {
        setOpenModal(true);
    }

    const selectedEmployee = useSelector(selectSelectedEmployee)
    if (!selectedEmployee) return <div className={"item-activity"}> Please select an employee to view work shifts</div>

    return <div className={"item-activity"}>
        <div className={"item-activity-headers"}>
            <div className={"bold"}>
                Work Shifts
            </div>

            <div className={"item-activity-buttons"}>
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={handleOpen}
                    startIcon={<AddIcon/>}>

                    Register WorkShift
                </Button>
                {
                    openModal
                    &&
                    <RegisterEmployeeWorkShift mode={"add"} handleWorkShiftClose={handleClose} open={openModal}/>
                }
            </div>
        </div>
        <div className={"item-activity-content"}>
            <StickyHeadWorkShiftsTable employeeId={selectedEmployee.id}/>
        </div>
    </div>

}

function StickyHeadWorkShiftsTable({employeeId}) {
    const [pageNumber, setPageNumber] = useState(1);
    const rowsPerPage = 8;

    const {data, isLoading} = useGetEmployeeWorkShiftsQuery({
        employeeId,
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
            label: 'Date',
        },
        {
            id: 'startTime',
            label: 'Start Time',
        },
        {
            id: 'endTime',
            label: 'End Time',
        },
        {
            id: 'breakMinutes',
            label: 'Break (minutes)',
        },
        {
            id: 'overTimeHours',
            label: 'Over Time (hours)',
        },
        {
            id: 'salaryEarned',
            label: 'Salary Earned (Rs)',
        }
    ]

    const rows = data?.workShifts || [];

    if (rows.length === 0) {
        if (pageNumber !== 1) setPageNumber(1);
        return <div className={"center"}>
            No work-shift record
        </div>
    }

    return <Paper sx={{width: '100%', overflow: 'hidden'}}>
        <TableContainer sx={{maxHeight: '85%'}}>
            <Table stickyHeader aria-label="All item stocks">
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
                        rows.map(shift => {
                            return <TableRow hover role="checkbox" tabIndex={-1} key={shift.id}>
                                {columns.map((column) => {
                                    const value = shift[column.id];

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
            onPageChange={handlePageChange}/>
    </Paper>
}

function WorkShiftsTableModal({open, handleClose}) {
    const selectedEmployee = useSelector(selectSelectedEmployee);
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
                <StickyHeadWorkShiftsTable employeeId={selectedEmployee.id}/>
            </Box>
        </Fade>
    </Modal>
}

export default EmployeeWorkShiftComponent;
export {WorkShiftsTableModal}