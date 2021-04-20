import React, {useEffect, useState} from "react";
import Page from "../../components/Page";
import PeopleSuggested from "../../components/Explore/ExplorePeopleItem";
// import NavBar from "../../components/SideBar/LeftSideBar";
// import {useAuthState} from "react-firebase-hooks/auth";
// import {auth} from "../../firebase";
// import {db} from "../../firebase";

const ExplorePeople = () => {
    useEffect(() => {
        window.scroll({top: 0, left: 0, behavior: 'smooth' });

    }, []);
    // const classes = useStyles();
    return (
        <Page
            title="Explore | LiveFood"
            className="app__bodyContainer"
        >
            <div className="explore__root">
                <PeopleSuggested />
            </div>

        </Page>
    )
}

export default ExplorePeople;