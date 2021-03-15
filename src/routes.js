import React from "react";
import { Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from "./views/auth/Login";
import HomePage from "./views/home/HomePage";
const routes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: 'login', element: <Login /> },
        ]
    }

];
export default routes;