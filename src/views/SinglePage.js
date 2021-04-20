import React, {useEffect, useState} from "react";
import Page from "../components/Page";
// import {makeStyles} from "@material-ui/core/styles";
import RightSideBar from "../components/SideBar/RightSideBar";
import Post from "../components/Posts/Post";
import NavBar from "../components/SideBar/LeftSideBar";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../firebase";
import {useParams} from "react-router";

import {makeStyles} from "@material-ui/core/styles";
import pic from "../images/Background/undraw_page_not_found_su7k.svg";

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
    }
}));

const SinglePage = (props) => {
    const classes = useStyles();
    const [user] = useAuthState(auth);
    let { id } = useParams();
    const [post, setPost] = useState([]);
    useEffect(() => {
        window.scroll({top: 0, left: 0, behavior: 'smooth' })

        db.collection('posts')
            .doc(id)
            .get().then(snapshot => {
                if (snapshot.exists){
                    setPost({
                        id: snapshot.id,
                        post: snapshot.data(),
                    });
                }
            });

    }, [id])



    return (
        <Page
            title="LiveFood"
            className="app__bodyContainer"
        >
            <NavBar auth={user}/>
            <div className="app__post">
                {
                    post?.post ? (
                        <Post
                            key={id}
                            id={id}
                            post={post.post}
                            author={post.post.uid}
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
                }
            </div>
            <RightSideBar auth={user}/>
        </Page>
    )
}

export default SinglePage;