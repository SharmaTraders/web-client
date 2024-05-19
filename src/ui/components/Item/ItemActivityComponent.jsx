import {useSelector} from "react-redux";
import {selectSelectedItem} from "../../../redux/features/state/itemState";
import "./ItemComponent.css"
import React, {useState} from "react";
import {useGetStocksByItemQuery} from "../../../redux/features/api/stockApi";
import Skeleton from "@mui/material/Skeleton";
import AddReduceStockComponent from "./AddReduceStockComponent";
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
import Box from "@mui/material/Box";
import {getBsDateFromAdDate} from "../../../utils/dateConverters";



function ItemActivityComponent() {
    const selectedItem = useSelector(selectSelectedItem);
    if (!selectedItem) return <div> Please select an item to view activity</div>

    return <div className={"item-activity"}>
        <div className={"item-activity-headers"}>
            <div className={"bold"}>
                Activity
            </div>

            <div className={"item-activity-buttons"}>
                <AddReduceStockComponent/>
            </div>
        </div>

        <div className={"item-activity-content"}>
            <StickyHeadStocksTable itemId={selectedItem.id}/>
        </div>

    </div>


}
function StickyHeadStocksTable({itemId}) {
    const [pageNumber, setPageNumber] = useState(1);
    const rowsPerPage = 8;

    const {data, isLoading} = useGetStocksByItemQuery({
        itemId,
        pageNumber,
        pageSize: rowsPerPage
    });

    if (isLoading) return <StickyHeadTableSkeleton count={6}/>

    function handlePageChange(event, newPage) {
        setPageNumber(newPage+1);
    }

    const columns = [
        {
            id: 'entryCategory', label: 'Type', minWidth: 170,
        },
        {
            id: 'date', label: 'Date', minWidth: 100
        },
        {
            id: 'weightChange',
            label: 'Weight change',
            minWidth: 170,
            align: 'center',
        },
        {
            id: 'remarks',
            label: 'Remarks',
            minWidth: 170,
            align: 'center',

        },
    ];

    const rows = data?.stocks || [];

    if (rows.length ===0) return  <div>
        No stock record yet
    </div>

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
                        rows.map(stock => {
                            return <TableRow hover role="checkbox" tabIndex={-1} key={stock.id}>
                                {columns.map((column) => {
                                    const value = stock[column.id];
                                    if (column.id === "weightChange" || column.id === "entryCategory") {
                                        let color = '#00a878';
                                        if (stock.entryCategory.toLowerCase() === 'reduce stock' || stock.entryCategory.toLowerCase() === "sales") {
                                            color = 'red';
                                        }

                                        return <TableCell key={column.id} align={column.align} sx={{color: color}}>
                                            {value}
                                        </TableCell>
                                    }

                                    if (column.id === "date"){
                                        return <TableCell key={column.id} align={column.align}>
                                            {getBsDateFromAdDate(value)}
                                        </TableCell>
                                    }

                                    return <TableCell key={column.id} align={column.align}>
                                        {value ?? '-'}
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

function StickyHeadTableSkeleton({count}) {
    function TableRow() {
        return <div className={"table-row"}>
            <div className={"table-text"}>
                <Skeleton animation="wave" variant="rectangular" width={40} height={10}/>

            </div>
            <div className={"table-text"}>
                <Skeleton animation="wave" variant="rectangular" width={40} height={10}/>

            </div>
            <div className={"table-text"}>
                <Skeleton animation="wave" variant="rectangular" width={40} height={10}/>

            </div>
            <div className={"table-text"}>
                <Skeleton animation="wave" variant="rectangular" width={40} height={10}/>
            </div>
        </div>
    }

    return <>
        <div className={"table-content"}>
            {
                Array.from({length: count}).map((_, index) => {
                    return <TableRow key={index}/>
                })
            }
        </div>

    </>

}


function StocksTableModal({open, handleClose}){
    const selectedItem = useSelector(selectSelectedItem);
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
                <StickyHeadStocksTable itemId={selectedItem.id}/>

            </Box>
        </Fade>
    </Modal>

}

export default ItemActivityComponent;
export {StocksTableModal, StickyHeadTableSkeleton} ;