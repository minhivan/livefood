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


const routes = (isLoggedIn)  => [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: 'messages', element: <Messenger /> },
            { path: 'messages/t/:id', element: <Messenger /> },
            // { path: 'explore', element: <Explore />},
            // { path: 'profile/:id', element: <UserProfilePage /> },
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
        element: isLoggedIn ? <MainLayout pageAccount={true}/> : <Navigate to="/login" />,
        children: [
            { path: 'edit', element: <EditAccountPage pagePath="account_edit"/> },
            { path: 'password/change', element: <EditAccountPage pagePath="account_password"/> },
            { path: 'setting/notifications', element: <EditAccountPage pagePath="account_setting"/> },
        ]
    },
    {
        path: '/profile/:id',
        element: <MainLayout pageProfile={true}/>,
        children: [
            { path: '/', element: <UserProfilePage pagePath="profile_feed"/> },
            { path: '/channel', element: <UserProfilePage  pagePath="profile_channel"/> },
            { path: '/saved', element: <UserProfilePage  pagePath="profile_saved"/> }
        ]
    },

];


export default routes;