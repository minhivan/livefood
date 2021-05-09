import React, {useEffect, useState} from "react";
import '../RightSideBar.css';

import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import IconButton from "@material-ui/core/IconButton";
import Skeleton from '@material-ui/lab/Skeleton';
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import {Button, Hidden, makeStyles, TextField} from "@material-ui/core";
import {blue} from "@material-ui/core/colors";
import {db} from "../../../firebase";
import {useDocument} from "react-firebase-hooks/firestore";
import {Link} from "react-router-dom";
import {handleUserFollow, handleUserUnfollow} from "../../../hooks/services";
import firebase from "firebase";
import {MessageCircle as CameraIcon} from "react-feather";

const useStyles = makeStyles((theme) => ({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    root: {
        width: "100%",
    },
    icon: {
        color: "#050505",
        margin: "20px"
    },
    wrapper: {
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        maxHeight: "200px",
        width: "100%"
    },
}));


function RightSideBar(props) {
    const classes = useStyles();
    const [users, setUsers] = useState([])
    const { userLogged } = props;
    const [chat, setChat] = useState([]);

    const userRef = userLogged?.uid && db.collection('users').doc(userLogged.uid);
    const [userSnapshot, loading] = useDocument(userRef);
    const authFollowingList = userSnapshot?.data()?.following;
    // List user
    useEffect(() => {
        var followingList = {};
        if(typeof authFollowingList !== 'undefined' && authFollowingList?.length >= 0){
            followingList = userSnapshot.data().following
            userLogged.uid && followingList.push(userLogged.uid);
            return db.collection("users")
                .limit(10)
                .get().then(snapshot => {
                    let data = [];
                    snapshot.forEach(function(doc) {
                        // doc.data() is never undefined for query doc snapshots
                        if(!followingList.includes(doc.id)){
                            data.push({id: doc.id, opponent: doc.data()})
                        }
                    });
                    setUsers(data);
                })
        }else{
             return db.collection("users")
                .where(firebase.firestore.FieldPath.documentId() ,'!=' , userLogged?.uid )
                .limit(4)
                 .get().then(snapshot => {
                    setUsers(snapshot.docs.map(doc => ({
                        id: doc.id,
                        opponent: doc.data(),
                    })));
                })
        }
    }, [loading, authFollowingList?.length])

    return(
        <Hidden mdDown>
            <div className="app__rightSideBar">
                <div className="sideBar__container">
                    {/* Chat to sasimi */}
                    <div className="trending__container sideBar__containerBlock">
                        <div className="trending__header bottomDivider padding-10-20">
                            <h2>Chat to Sasimi ?</h2>
                            <IconButton aria-label="comment" >
                                <SettingsOutlinedIcon />
                            </IconButton>
                        </div>
                        <div className="trending__content bottomDivider">
                            <div className="chat__container">
                                {/*<div className="chat__content">*/}
                                {/*    <div className="chat__message false">*/}
                                {/*        <div className="chat__details"><span*/}
                                {/*            className="makeStyles-chat-36">hi broo</span></div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className="chat__content">*/}
                                {/*    <div className="chat__message sender">*/}
                                {/*        <div className="chat__details"><span*/}
                                {/*            className="makeStyles-chat-36">whatsup  asd asd asd asd asd asda sdasd asda sdasd asda dasda sd</span></div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <div className={classes.wrapper}>
                                    <div className={classes.none}>
                                        <CameraIcon
                                            className={classes.icon}
                                            size="40"
                                        />
                                    </div>
                                    <h4 style={{paddingBottom: "10px"}}>Chat to Sasimi now</h4>
                                </div>
                                <div className="makeStyles-bottom-20" />
                            </div>
                        </div>
                        <div role="button" className="padding-10-20 show-more right-chat-input">
                            <TextField
                                className="right-chat-input__holder"
                                placeholder="What do you want ?"
                                value={chat}
                                onChange={event => setChat(event.target.value)}
                                InputProps={{ disableUnderline: true}}
                                size="small"
                            />
                            <Button variant="contained">
                                Send
                            </Button>
                        </div>
                    </div>

                    {/* Suggest user */}
                    <div className="suggest__container sideBar__containerBlock">
                        <div className="suggest__header padding-20 bottomDivider">
                            <h2>Who to follow</h2>
                        </div>
                        {
                            users ? (users.slice(0,4).map(({id, opponent}) => (
                                <div key={id} className="suggest__content  bottomDivider">
                                    <CardHeader
                                        className="suggest__user"
                                        avatar={
                                            <Avatar className={classes.avatar} aria-label={opponent.displayName} src={opponent.photoURL} />
                                        }
                                        title={
                                            <Link to={`profile/${id}`}>{opponent.displayName}</Link>
                                        }
                                        subheader={opponent.fullName}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        className="followBtn"
                                        onClick={() => handleUserFollow(userLogged.uid, opponent.uid)}
                                    >
                                        Follow
                                    </Button>
                                </div>
                            ))) : (
                                <>
                                    <div className={classes.root}>
                                        <Skeleton variant="rect" height={300} />
                                    </div>
                                </>
                            )
                        }

                        <div role="button" className="padding-20 show-more">
                            <Link to="/explore/people">
                                <span className="" style={{fontSize: "1.2rem"}}>Show more</span>
                            </Link>

                        </div>
                    </div>

                </div>
            </div>
        </Hidden>


    )
}

export default RightSideBar;