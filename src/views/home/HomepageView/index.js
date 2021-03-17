import React from "react";
import Page from "../../../components/Page";
import {makeStyles} from "@material-ui/core/styles";
import RightSideBar from "../../../components/AppBar/RightSideBar";
import Post from "../../../components/Post";
import NavBar from "../../../layouts/MainLayout/NavBar";


const useStyles = makeStyles((theme) => ({

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