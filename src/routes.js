import React from "react";
import { Navigate } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import DefaultLayout from "./layouts/DefaultLayout";
import Login from "./views/auth/SignInPage";
import HomePage from "./views/HomePage";
import NotFoundView from "./views/NotFoundPage"
import Messenger from "./views/MessengerPage";
import SignUp from "./views/auth/SignUpPage";
import Explore from "./views/Explore/ExplorePage";
import UserProfilePage from "./views/account/UserProfilePage";
import EditAccountPage from "./views/account/EditAccountPage";
import SinglePage from "./views/SinglePage";
import ExplorePeople from "./views/Explore/ExplorePeoplePage";


const routes = (isLoggedIn)  => [

    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: 'p/:id', element: <SinglePage type="post" />},
            // { path: 'explore', element: <Explore />},
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
        path: '/explore',
        element: isLoggedIn ? <MainLayout/> : <Navigate to="/login" />,
        children: [
            // { path: '/', element: <Explore /> },
            { path: '/people', element: <ExplorePeople /> },
        ]
    },
    {
        path: '/messages',
        element: isLoggedIn ? <MainLayout/> : <Navigate to="/login" />,
        children: [
            { path: '/', element: <Messenger /> },
            { path: '/t/:id', element: <Messenger /> },
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
        path: '/profile',
        element: <MainLayout pageProfile={true}/>,
        children: [
            { path: '/:id', element: <UserProfilePage pagePath="profile_feed"/> },
            { path: '/channel/:id', element: <UserProfilePage  pagePath="profile_channel"/> },
            { path: '/saved/:id', element: <UserProfilePage  pagePath="profile_saved"/> }
        ]
    },

];


export default routes;