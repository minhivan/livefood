import React from "react";
import { Navigate } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import DefaultLayout from "./layouts/DefaultLayout";
import Login from "./views/auth/SignInPage";
import HomePage from "./views/HomePage";
import NotFoundView from "./views/NotFoundPage"
import Messenger from "./views/MessengerPage";
import SignUp from "./views/auth/SignUpPage";
import Explore from "./views/explore/ExplorePage";
import UserProfilePage from "./views/account/UserProfilePage";
import EditAccountPage from "./views/account/EditAccountPage";
import SinglePage from "./views/SinglePage";
import ExplorePeople from "./views/explore/ExplorePeoplePage";
import ExploreVideo from "./views/explore/ExploreVideoPage";
import RecipePage from "./views/RecipePage";


const routes = (isLoggedIn)  => [

    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: 'p/:id', element: <SinglePage type="post" />},
            { path: 'recipe/', element: <RecipePage />},
            { path: '/', element: isLoggedIn ? <HomePage userLogged={isLoggedIn}/> : <Navigate to="/explore" />  },
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
        element: <MainLayout/>,
        children: [
            // { path: '/', element: <Explore userLogged={isLoggedIn}/> },
            { path: '/people', element: isLoggedIn ? <ExplorePeople userLogged={isLoggedIn}/> : <Navigate to="/login" />  },
            // { path: '/watch', element:  <ExploreVideo userLogged={isLoggedIn}/> },
            { path: '/watch'},
        ]
    },
    {
        path: '/messages',
        element: isLoggedIn ? <MainLayout/> : <Navigate to="/login" />,
        children: [
            { path: '/', element: <Messenger userLogged={isLoggedIn}/> },
            { path: '/t/:id', element: <Messenger userLogged={isLoggedIn}/> },
        ]
    },
    {
        path: '/account',
        element: isLoggedIn ? <MainLayout /> : <Navigate to="/login" />,
        children: [
            { path: 'edit', element: <EditAccountPage userLogged={isLoggedIn} pagePath="account_edit"/> },
            { path: 'password/change', element: <EditAccountPage userLogged={isLoggedIn} pagePath="account_password"/> },
            { path: 'setting/notifications', element: <EditAccountPage userLogged={isLoggedIn} pagePath="account_setting"/> },
        ]
    },
    {
        path: '/profile',
        element: <MainLayout pageProfile={true}/>,
        children: [
            { path: '/:id', element: <UserProfilePage userLogged={isLoggedIn} pagePath="profile_feed"/> },
            { path: '/channel/:id', element: <UserProfilePage userLogged={isLoggedIn} pagePath="profile_channel"/> },
            { path: '/saved/:id', element: <UserProfilePage userLogged={isLoggedIn}  pagePath="profile_saved"/> }
        ]
    },

];


export default routes;