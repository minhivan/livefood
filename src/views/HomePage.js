import React from "react";
import Page from "../components/Page";
import RightSideBar from "../components/SideBar/RightSideBar";
import NewFeed from "../components/Posts";
import NavBar from "../components/SideBar/LeftSideBar";
import {Navigate} from "react-router-dom";


const HomePage = (props) => {

    window.scroll({top: 0, left: 0, behavior: 'smooth' })

    if (!props.userLogged){
        return <Navigate to="/explore"/>
    }

    return (
        <Page
            title="LiveFood"
            className="app__bodyContainer"
        >
            <NavBar userLogged={props.userLogged}/>
            <NewFeed userLogged={props.userLogged}/>
            <RightSideBar userLogged={props.userLogged}/>
        </Page>
    )
}

export default HomePage;