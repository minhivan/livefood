import React, {useEffect} from "react";
import Page from "../components/Page";
// import {makeStyles} from "@material-ui/core/styles";
import RightSideBar from "../components/SideBar/RightSideBar";
import Post from "../components/Post";
import NavBar from "../components/SideBar/LeftSideBar";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";


const HomePage = () => {
    const [user] = useAuthState(auth);

    useEffect(() => {
        window.scroll({top: 0, left: 0, behavior: 'smooth' })
    }, [])

    return (
        <Page
            title="LiveFood"
            className="app__bodyContainer"
        >
            <NavBar auth={user}/>
            <Post/>
            <RightSideBar auth={user}/>
        </Page>
    )
}

export default HomePage;