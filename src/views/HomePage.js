import React from "react";
import Page from "../components/Page";
// import {makeStyles} from "@material-ui/core/styles";
import RightSideBar from "../components/RightSideBar/RightSideBar";
import Post from "../components/Post";
import NavBar from "../layouts/MainLayout/NavBar";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";


// const useStyles = makeStyles((theme) => ({
//     header: {
//         position: "relative",
//         height: "calc(100vh - 100px)"
//     }
// }));

const HomePage = () => {
    const [user] = useAuthState(auth);
    console.log(user?.displayName)
    return (
        <Page
            title="LiveFood"
            className="app__bodyContainer"
        >
            <NavBar auth={user}/>
            <Post auth={user}/>
            <RightSideBar auth={user}/>
        </Page>
    )
}

export default HomePage;