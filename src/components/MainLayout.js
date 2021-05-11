import React from "react";
import { Outlet } from 'react-router-dom';
import LayoutAppBar from "./Header";

const MainLayout = (props) => {
    window.scroll({top: 0, left: 0, behavior: 'smooth' });
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
