import { useDispatch, useSelector } from "react-redux";
import {
    selectSelectedEmployee, setSelectedEmployee
} from "../../../redux/features/state/employeeState";
import { useGetEmployeesQuery } from "../../../redux/features/api/employee";
import { Avatar, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import Skeleton from '@mui/material/Skeleton';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';

function EmployeeList() {
    const [sort, setSort] = useState("name asc");
    const [searchString, setSearchString] = useState("");
    const dispatch = useDispatch();
    const selectedEmployee = useSelector(selectSelectedEmployee);
    const { data, isLoading, error } = useGetEmployeesQuery();

    if (isLoading) {
        const mockSkeletonsAmount = 5;
        return Array.from({ length: mockSkeletonsAmount }, (_, index) => (
            <EmployeeCardSkeleton key={index} />
        ));
    }
    if (error) {
        return <div> Something went wrong </div>;
    }
    if (!data) return;

    const employees = data.employees || [];

    if (employees.length === 0) {
        return <div>
            No employees found. You can add a new employee by clicking the Add Employee button above.
        </div>;
    }

    function getClassName(employee) {
        if (!selectedEmployee) return "employee-card";
        return employee.id === selectedEmployee.id ? "employee-card employee-selected" : "employee-card";
    }


    let employeesToShow = [...employees];

    if (sort === "name asc") {
        employeesToShow = employeesToShow.sort((a, b) => a.name.localeCompare(b.name));
    }
    else if (sort === "name desc") {
        employeesToShow = employeesToShow.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (searchString) {
        employeesToShow = employeesToShow.filter(
            employee => employee.name.toLowerCase().includes(searchString.toLowerCase())
        );
    }

    function setSelected(employee) {
        dispatch(setSelectedEmployee(employee));
    }

    return <>
        <div className={"employee-list-filter"}>
            <TextField
                type="Search"
                margin="dense"
                fullWidth
                size={"small"}
                onChange={(e) => {
                    setSearchString(e.target.value);
                }}
                required
                label="Search"
                InputProps={{
                    startAdornment:
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>,
                }} />

            <FormControl sx={{ m: 1, minWidth: 140, ml: -0.25, borderRight: "none" }} size="small">
                <InputLabel id="sort-label">Sort</InputLabel>

                <Select
                    labelId="sort-label"
                    label="Sort"
                    value={sort}
                    onChange={(e) => {
                        setSort(e.target.value);
                    }}
                    IconComponent={SortIcon}
                >
                    <MenuItem value={"name asc"}>
                        Name (A - Z)
                    </MenuItem>

                    <MenuItem value={"name desc"}>
                        Name (Z - A)
                    </MenuItem>
                </Select>
            </FormControl>
        </div>

        <div className={"page-list"}>
            {
                employeesToShow.map((employee) =>
                    <div key={employee.id} className={getClassName(employee)}
                         onClick={() => setSelected(employee)}>
                        <EmployeeCard
                            employee={employee}
                            isSelected={selectedEmployee && employee.id === selectedEmployee.id} />
                    </div>
                )
            }
        </div>
    </>;
}

function EmployeeCard({ employee }) {
    function getStatusClassName(employee) {
        if (employee.status.toString().toLowerCase()=== "active") {
            return "primary-color";
        }
        else {
            return "error-color";
        }
    }
    return <>
        <div className={"employee-info"}>
            <Avatar variant="circular">
                {employee.name.charAt(0)}
            </Avatar>
            <div> {employee.name}</div>
        </div>

        <div className={"employee-status"}>
            <div className={`${getStatusClassName(employee)} bold`}>
                {employee.status}
            </div>
        </div>
    </>;
}

function EmployeeCardSkeleton() {
    return <>
        <div className={"employee-info"}>
            <Skeleton animation="wave" variant="circular" width={40} height={40} />
            <Skeleton animation="wave" variant="rounded" width={40} height={10} />
        </div>

        <div className={"employee-status"}>
            <div>
                <Skeleton animation="wave" variant="rounded" width={40} height={10} />
            </div>
            <div>
                <Skeleton animation="wave" variant="rounded" width={40} height={10} />
            </div>
        </div>
    </>;
}

export default EmployeeList;
