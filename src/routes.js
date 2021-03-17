import React from "react";
import { Navigate } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import DefaultLayout from "./layouts/DefaultLayout";
import Login from "./views/auth/SignIn";
import HomePage from "./views/home/HomepageView";
import NotFoundView from "./views/errors/NotFoundView"
import Messenger from "./views/messenger/MessengerPage";
import SignUp from "./views/auth/SignUp";


const routes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: 'messenger/:id', element: <Messenger /> },
            { path: 'profile/:id', element: <HomePage />},
            { path: '/', element: <HomePage />},
            { path: '404', element: <NotFoundView /> },
            { path: '*', element: <Navigate to="/404" /> }
        ]
    },
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'register', element: <SignUp /> },
        ]
    }
];


export default routes;