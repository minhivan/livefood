import React from "react";
import Page from "../components/Page";
// import {makeStyles} from "@material-ui/core/styles";
import RightSideBar from "../components/SideBar/RightSideBar";
import NewFeed from "../components/Posts";
import NavBar from "../components/SideBar/LeftSideBar";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";


const HomePage = () => {
    const [user] = useAuthState(auth);
    window.scroll({top: 0, left: 0, behavior: 'smooth' })

    return (
        <Page
            title="LiveFood"
            className="app__bodyContainer"
        >
            <NavBar user={user}/>
            <NewFeed />
            <RightSideBar user={user}/>
        </Page>
    )
}

export default HomePage;