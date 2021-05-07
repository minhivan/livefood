import React from "react";
import NavBar from "../components/SideBar/LeftSideBar";
import RightSideBar from "../components/SideBar/RightSideBar";
import Page from "../components/Page";

export default function LocationPage(props){
    return (
        <Page
            title="LiveFood"
            className="app__bodyContainer"
        >
            <NavBar userLogged={props.userLogged}/>
            <div className="app__post">

            </div>
            <RightSideBar userLogged={props.userLogged}/>
        </Page>
    )
}