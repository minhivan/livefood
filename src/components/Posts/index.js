import React, {useEffect, useState} from "react";
import Upload from "../Upload";
import Post from "./Post";
import { db } from "../../firebase";
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

export default function NewFeed(props){
    const classes = useStyles();
    const {userLogged} = props;
    const [posts, setPosts] = useState([]);
    const userRef = userLogged && db.collection('users').doc(userLogged.uid);
    const [userSnapshot] = useDocument(userRef);

    let userFollow = userSnapshot?.data()?.following;

    //Get post
    useEffect( () => {
        if(typeof userFollow !== 'undefined' && userFollow.length > 0){
            userFollow.push(userLogged.uid);
            const unsubscribe = db.collection('posts')
                .orderBy('timestamp', "desc")
                .limit(5)
                .onSnapshot((snapshot) => {
                    var data = [];
                    snapshot.forEach((doc) => {
                        if(userFollow.includes(doc.data().uid)){
                            data.push({id: doc.id, post: doc.data()})
                        }
                    })
                    setPosts(data);
                })
            return () => {
                unsubscribe();
            }
        }
        else{
            const unsubscribe = db.collection('posts')
                .where('uid', '==', userLogged.uid)
                .orderBy('timestamp', "desc")
                .limit(5)
                .onSnapshot( snapshot => {
                    setPosts(snapshot.docs.map(doc => ({
                        id: doc.id,
                        post: doc.data(),
                    })));
                })

            return () => {
                unsubscribe();
            }
        }
    }, [userFollow?.length, userLogged?.uid]);


    function handleRemove(id) {
        const newList = posts.filter((item) => item.id !== id);
        setPosts(newList);
    }


    return(
        <div className="app__post">
            {
                userLogged ? (
                    <Upload userLogged={userLogged}/>
                ) : null
            }
            {
                posts?.length > 0 ? (
                    posts.map(({id, post, postAuthor }) => (
                        <Post
                            key={id}
                            id={id}
                            post={post}
                            userLogged={userLogged}
                            handleRemove={() => handleRemove(id)}
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