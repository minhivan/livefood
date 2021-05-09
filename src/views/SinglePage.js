import React, {useEffect, useState} from "react";
import Page from "../components/Page";
// import {makeStyles} from "@material-ui/core/styles";
import RightSideBar from "../components/SideBar/RightSideBar";
import Post from "../components/Posts/Post";
import NavBar from "../components/SideBar/LeftSideBar";
import {db} from "../firebase";
import {useParams} from "react-router";

import {makeStyles} from "@material-ui/core/styles";
import pic from "../images/Background/undraw_page_not_found_su7k.svg";
import {useDocument} from "react-firebase-hooks/firestore";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';




const useStyles = makeStyles((theme) => ({

    wrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        maxHeight: "300px",
        width: "100%"
    },
    redirect: {
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        paddingTop: "20px"
    },
    details: {
        padding: "20px 0"
    },
    title: {
        color: "#ffffff",
    },
    img: {
        width: "320px",
        display: "inline-block",
        maxWidth: "100%",
        marginTop: "50px"
    },
    imgHolder: {
        textAlign: "center"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const SinglePage = (props) => {
    const classes = useStyles();
    let { id } = useParams();
    const [postSnapshot, loading] = useDocument(db.collection("posts").doc(id));


    return (
        <Page
            title="LiveFood"
            className="app__bodyContainer"
        >
            <NavBar userLogged={props.userLogged}/>
            <div className="app__post">
                {
                    loading ? (
                        <Backdrop className={classes.backdrop} open={loading} >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                    ) : (
                        postSnapshot?.data() ? (
                            <Post
                                key={postSnapshot.id}
                                id={postSnapshot.id}
                                post={postSnapshot.data()}
                                isSinglePage={true}
                            />
                        ) : (
                            <>
                                <div className={classes.wrapper}>
                                    <div className={classes.imgHolder}>
                                        <img src={pic} alt="404" className={classes.img}/>
                                    </div>
                                    <div className={classes.details}>
                                        <h1>This page doesn’t exist</h1>
                                        <p>Please check your URL or return to LiveFood home.</p>
                                    </div>
                                </div>
                            </>
                        )
                    )
                }


            </div>
            {
                props.userLogged ? (
                    <RightSideBar userLogged={props.userLogged}/>
                ) : null
            }
        </Page>
    )
}

export default SinglePage;