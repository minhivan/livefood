import React from "react";

import { Outlet } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import LayoutAppBar from "./AppBar";
const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        width: '100%'
    },
}));


const MainLayout = () => {
    const classes = useStyles();
    return (
        <div className="app">
            <LayoutAppBar/>
            <div className="app__body">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
