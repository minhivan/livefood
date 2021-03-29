import React from "react";
import { Navigate } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import DefaultLayout from "./layouts/DefaultLayout";
import Login from "./views/auth/SignInPage";
import HomePage from "./views/HomePage";
import NotFoundView from "./views/NotFoundPage"
import Messenger from "./views/MessengerPage";
import SignUp from "./views/auth/SignUpPage";
import Explore from "./views/ExplorePage";
import UserProfilePage from "./views/account/UserProfilePage";
import EditAccountPage from "./views/account/EditAccountPage";


const routes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: 'messages', element: <Messenger /> },
            { path: 'messages/t/:id', element: <Messenger /> },
            // { path: 'explore', element: <Explore />},
            { path: 'profile/:id', element: <UserProfilePage /> },
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
            { path: 'register', element: <SignUp /> }
        ]
    },
    {
        path: '/account',
        element: <MainLayout pageAccount={true}/>,
        children: [
            { path: 'edit', element: <EditAccountPage action="account_edit"/> },
            { path: 'password/change', element: <EditAccountPage action="account_password"/> }
        ]
    },
    {
        path: '/profile',
        element: <DefaultLayout />,
        children: [
            // { path: 'edit', element: <EditAccountPage /> },
            // { path: 'register', element: <SignUp /> }
        ]
    },

];


export default routes;