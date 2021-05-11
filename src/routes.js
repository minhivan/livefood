import React from "react";
import { Navigate } from 'react-router-dom';
import MainLayout from "./components/MainLayout";
import DefaultLayout from "./components/DefaultLayout";
import Login from "./views/auth/SignInPage";
import HomePage from "./views/HomePage";
import NotFoundView from "./views/NotFoundPage"
import Messenger from "./views/MessengerPage";
import SignUp from "./views/auth/SignUpPage";
import Forgot from "./views/auth/ForgotPassword"
import Explore from "./views/explore/ExplorePage";
import UserProfilePage from "./views/account/UserProfilePage";
import EditAccountPage from "./views/account/EditAccountPage";
import SinglePage from "./views/SinglePage";
import ExplorePeople from "./views/explore/ExplorePeoplePage";
import ExploreVideo from "./views/explore/ExploreVideoPage";
import RecipePage from "./views/recipe/RecipePage";
import TopicPage from "./views/recipe/TopicPage";
import TrendingPage from "./views/recipe/TrendingPage";
import ResultRecipePace from "./views/recipe/ResultRecipePace";
import LocationPage from "./views/LocationPage";


const routes = (isLoggedIn)  => [

    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: 'p/:id', element: <SinglePage userLogged={isLoggedIn} type="post" />},
            { path: 'location', element: <LocationPage userLogged={isLoggedIn} />},
            { path: '/', element: <HomePage userLogged={isLoggedIn}/> },
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
            { path: 'forgot', element: <Forgot /> }
        ]
    },
    {
        path: '/recipe',
        element: <MainLayout/>,
        children: [
            { path: '/', element: <RecipePage userLogged={isLoggedIn}/>},
            { path: 'topic/:name/', element: <TopicPage userLogged={isLoggedIn}/>},
            { path: 'trending/', element: <TrendingPage userLogged={isLoggedIn}/>},
            { path: 'search/', element: <ResultRecipePace userLogged={isLoggedIn}/>},
        ]
    },
    {
        path: '/explore',
        element: <MainLayout/>,
        children: [
            { path: '/', element: <Explore userLogged={isLoggedIn}/> },
            { path: '/news', element: <Explore userLogged={isLoggedIn}/> },
            { path: '/people',  element: isLoggedIn ? <ExplorePeople userLogged={isLoggedIn}/> : <Navigate to="/login" />  },
            { path: '/watch', element:  <ExploreVideo userLogged={isLoggedIn}/> },
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
            { path: 'edit', element: <EditAccountPage userLogged={isLoggedIn} pagePath="edit"/> },
            { path: 'password/change', element: <EditAccountPage userLogged={isLoggedIn} pagePath="password"/> },
            { path: 'setting/notifications', element: <EditAccountPage userLogged={isLoggedIn} pagePath="setting"/> },
            { path: 'shop/edit', element: <EditAccountPage userLogged={isLoggedIn} pagePath="shop"/> },
            { path: 'shop/about', element: <EditAccountPage userLogged={isLoggedIn} pagePath="about"/> },
        ]
    },
    {
        path: '/profile',
        element: isLoggedIn ? <MainLayout/> : <Navigate to="/login" />,
        children: [
            { path: '/:id', element: <UserProfilePage userLogged={isLoggedIn} pagePath="feed"/> },
            { path: '/channel/:id', element: <UserProfilePage userLogged={isLoggedIn} pagePath="channel"/> },
            { path: '/saved/:id', element: <UserProfilePage userLogged={isLoggedIn}  pagePath="saved"/> },
            { path: '/dishes/:id', element: <UserProfilePage userLogged={isLoggedIn}  pagePath="dishes"/> }
        ]
    },

];


export default routes;