import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {useGetItemsQuery} from "../../../redux/features/api/itemApi";
function ListOfItems() {
    const columns = [
        { field: 'id', headerName: 'Item Name', width: 150 },
    ]

    const {data , isLoading, isError} = useGetItemsQuery()

    // If the query is still loading, you can return a loading indicator.
    if (isLoading) return <div>Loading...</div>;
    // In case of an error, you can return an error message.
    if (isError) return <div>Error loading items</div>;

    const items = data.items;
    const rows = items?.map( item => ({
        id: item.name,
        name: item.name
    }))

    return (

        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
            />
        </Box>
    );
}

export {ListOfItems}