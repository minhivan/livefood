import React from "react";
import { Navigate } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import DefaultLayout from "./layouts/DefaultLayout";
import Login from "./views/SignInPage";
import HomePage from "./views/HomePage";
import NotFoundView from "./views/NotFoundPage"
import Messenger from "./views/MessengerPage";
import SignUp from "./views/SignUpPage";
import Explore from "./views/ExplorePage";
import UserProfilePage from "./views/UserProfilePage";


const routes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: 'messenger/:id', element: <Messenger /> },
            { path: 'profile/:id', element: <UserProfilePage />},
            { path: 'explore', element: <Explore />},
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