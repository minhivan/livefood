import React from "react";
import Page from "../../../components/Page";
import {makeStyles} from "@material-ui/core/styles";
import RightSideBar from "../../../components/RightSideBar/RightSideBar";
import Post from "../../../components/Post";
import NavBar from "../../../layouts/MainLayout/NavBar";


const useStyles = makeStyles((theme) => ({
    header: {
        position: "relative",
        height: "calc(100vh - 100px)"
    }
}));
const HomePage = () => {
    const classes = useStyles();
    return (
        <Page
            title="LiveFood"
            className="app__bodyContainer"
        >
            <NavBar />
            <Post />
            <RightSideBar/>
        </Page>
    )
}

export default HomePage;