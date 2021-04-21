import React, {useEffect, useState} from "react";
import Upload from "../Upload";
import Post from "./Post";
import { db, auth } from "../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {Compass as CompassIcon} from "react-feather";
import {makeStyles} from "@material-ui/core/styles";
import {useDocument} from "react-firebase-hooks/firestore";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme) => ({
    icon: {
        color: "#050505"
    },
    wrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        maxHeight: "300px",
        width: "100%"
    },
    none: {
        width: "100px",
        height: "100px",
        borderColor: "#262626",
        borderWidth: "2px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        borderRadius: "50%",
        margin: "50px 0 20px 0"
    }
}));

export default function NewFeed(){
    const classes = useStyles();
    const [posts, setPosts] = useState([]);
    const [ authUser ] = useAuthState(auth);

    const userRef = db.collection('users').doc(authUser.uid);
    const [userSnapshot] = useDocument(userRef);

    let userFollow = userSnapshot?.data()?.following;
    //Get post
    useEffect( () => {
        var userFollowingList;
        if(typeof userFollow !== 'undefined' && userFollow.length > 0){
            userFollowingList = userFollow;
            userFollowingList.push(authUser.uid);
            return db.collection('posts')
                .orderBy('timestamp', "desc")
                .where('uid', 'in', userFollowingList)
                .onSnapshot(snapshot => {
                    setPosts(snapshot.docs.map(doc => ({
                        id: doc.id,
                        post: doc.data(),
                    })));
                })
        }
        else{
            return db.collection('posts')
                .orderBy('timestamp', "desc")
                .where('uid', '==', authUser.uid)
                .onSnapshot(snapshot => {
                    setPosts(snapshot.docs.map(doc => ({
                        id: doc.id,
                        post: doc.data(),
                    })));
                })
        }

    }, [userFollow?.length]);



    return(
        <div className="app__post">
            {
                authUser ? (
                    <Upload user={authUser}/>
                ) : null
            }
            {
                posts.length > 0 ? (
                    posts.map(({id, post}) => (
                        <Post
                            key={id}
                            id={id}
                            post={post}
                            author={post.uid}
                        />
                    ))
                ) : (
                    <div className={classes.wrapper}>
                        <div className={classes.none}>
                            <CompassIcon
                                className={classes.icon}
                                size="40"
                            />
                        </div>
                        <h2 style={{paddingBottom: "10px"}}>Start Explore Yourself</h2>
                        <p style={{paddingBottom: "20px"}}>Or just creating your own post.</p>

                        <Link to="/explore">
                            <Button
                                style={{textTransform: "capitalize", fontSize: "16px"}}
                                color="primary"
                                variant="contained"
                            >
                                Explore
                            </Button>
                        </Link>

                    </div>
                )

            }
        </div>
    )
}
