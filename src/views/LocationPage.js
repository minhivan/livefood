import React from "react";
import NavBar from "../components/SideBar/LeftSideBar";
import Page from "../components/Page";
import Survey from "../components/Popup/Survey";

export default function LocationPage(props){
    return (
        <Page
            title="LiveFood"
            className="app__bodyContainer"
        >
            <NavBar userLogged={props.userLogged}/>
            <div className="app__post">
                <Survey />
            </div>
        </Page>
    )
}