import React from "react";
import { Outlet } from 'react-router-dom';
import LayoutAppBar from "./Header";

const MainLayout = (props) => {
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
