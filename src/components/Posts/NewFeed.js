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
    },
    buttonLoadMore: {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        margin: "10px 0 50px 0"
    }
}));

export default function NewFeed(props){
    const classes = useStyles();
    const {userLogged} = props;
    const [posts, setPosts] = useState([]);
    const userRef = userLogged && db.collection('users').doc(userLogged.uid);
    const [userSnapshot] = useDocument(userRef);
    const [limit, setLimit] = useState(20);
    const [lastVisible, setLastVisible] = useState('');
    let userFollow = userSnapshot?.data()?.following;

    //Get post
    useEffect( () => {
        if(typeof userFollow !== 'undefined' && userFollow.length > 0){
            userFollow.push(userLogged.uid);
            const unsubscribe = db.collection('posts')
                .orderBy('timestamp', "desc")
                .limit(limit)
                .onSnapshot((snapshot) => {
                    let data = [];
                    snapshot.forEach((doc) => {
                        if(userFollow.includes(doc.data().uid)){
                            data.push({id: doc.id, post: doc.data()})
                        }
                    })
                    setPosts(data);
                    setLastVisible(data.length);
                })
            return () => {
                unsubscribe();
            }
        }
        else{
            const unsubscribe = db.collection('posts')
                .where('uid', '==', userLogged.uid)
                .orderBy('timestamp', "desc")
                .limit(limit)
                .onSnapshot( snapshot => {
                    setPosts(snapshot.docs.map(doc => ({
                        id: doc.id,
                        post: doc.data(),
                    })));
                    setLastVisible(snapshot.docs.length-1);
                })

            return () => {
                unsubscribe();
            }
        }
    }, [userFollow?.length, userLogged?.uid, limit]);


    function handleRemove(id) {
        const newList = posts.filter((item) => item.id !== id);
        setPosts(newList);
    }


    //
    // window.onscroll = function () {
    //     if(window.scrollY + window.innerHeight >=
    //         document.documentElement.scrollHeight){
    //         loadMore()
    //     }
    // }

    const loadMore = () => {
        if(lastVisible){
            setLimit(limit => limit + 10);
        }
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
                    <>
                        {
                            posts.map(({id, post, postAuthor }) => (
                                <Post
                                    key={id}
                                    id={id}
                                    post={post}
                                    userLogged={userLogged}
                                    handleRemove={() => handleRemove(id)}
                                />
                            ))
                        }
                        {
                            posts?.length < limit ? (
                                <div className={classes.buttonLoadMore}>
                                    <Button
                                        onClick={loadMore}
                                        style={{textTransform: "capitalize", fontSize: "16px"}}
                                        color="primary"
                                        variant="contained"
                                    >
                                        See more
                                    </Button>
                                </div>
                            ) : null
                        }
                    </>

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