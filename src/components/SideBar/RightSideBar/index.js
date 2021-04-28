import React, {useEffect, useState} from "react";
import '../RightSideBar.css';

import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import IconButton from "@material-ui/core/IconButton";
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import Skeleton from '@material-ui/lab/Skeleton';
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import {Button, Hidden, makeStyles} from "@material-ui/core";
import {blue} from "@material-ui/core/colors";



// import dayjs from "dayjs";

import {db} from "../../../firebase";
import {useDocument} from "react-firebase-hooks/firestore";
import {Link} from "react-router-dom";
import handleUserFollow from "../../../utils/handleUserFollow";
import firebase from "firebase";


const useStyles = makeStyles((theme) => ({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    root: {
        width: "100%",
    },
}));


function RightSideBar(props) {
    const classes = useStyles();
    const [users, setUsers] = useState([])
    const { userLogged } = props;

    const userRef = userLogged.uid && db.collection('users').doc(userLogged.uid);
    const [userSnapshot] = useDocument(userRef);

    // List user
    useEffect(() => {

        if(typeof userSnapshot?.data()?.following !== 'undefined' && userSnapshot?.data()?.following.length >= 0){
            var followingList = {};
            followingList = userSnapshot.data().following
            userLogged.uid && followingList.push(userLogged.uid);

            return db.collection("users")
                .where(firebase.firestore.FieldPath.documentId() ,'not-in' , followingList )
                .limit(4)
                .get().then(snapshot => {
                    setUsers(snapshot.docs.map(doc => ({
                        id: doc.id,
                        opponent: doc.data(),
                    })));
                })
        }else{
             return db.collection("users")
                .where(firebase.firestore.FieldPath.documentId() ,'!=' , userLogged.uid )
                .limit(4)
                .get().then(snapshot => {
                    setUsers(snapshot.docs.map(doc => ({
                        id: doc.id,
                        opponent: doc.data(),
                    })));
                })
        }
    }, [userLogged.uid, userSnapshot])


    return(
        <Hidden mdDown>
            <div className="app__rightSideBar">
                <div className="sideBar__container">
                    {/*<div className="trending__container sideBar__containerBlock">*/}
                    {/*    <div className="trending__header bottomDivider padding-10-20">*/}
                    {/*        <h2>What's fresh?</h2>*/}
                    {/*        <IconButton aria-label="comment" >*/}
                    {/*            <SettingsOutlinedIcon />*/}
                    {/*        </IconButton>*/}
                    {/*    </div>*/}
                    {/*    <div className="trending__content padding-10-20 bottomDivider">*/}
                    {/*        <div className="trending__contentBlock">*/}
                    {/*            <div className="trending__header">*/}
                    {/*                <h4>Trending in VietNam</h4>*/}
                    {/*                <IconButton aria-label="comment" >*/}
                    {/*                    <MoreHorizOutlinedIcon />*/}
                    {/*                </IconButton>*/}
                    {/*            </div>*/}
                    {/*            <div className="trending__name">*/}
                    {/*                <h3>Healthy</h3>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className="trending__content padding-10-20 bottomDivider">*/}
                    {/*        <div className="trending__contentBlock">*/}
                    {/*            <div className="trending__header">*/}
                    {/*                <h4>Trending in VietNam</h4>*/}
                    {/*                <IconButton aria-label="comment" >*/}
                    {/*                    <MoreHorizOutlinedIcon />*/}
                    {/*                </IconButton>*/}
                    {/*            </div>*/}
                    {/*            <div className="trending__name">*/}
                    {/*                <h3>Healthy</h3>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className="trending__content padding-10-20 bottomDivider">*/}
                    {/*        <div className="trending__contentBlock">*/}
                    {/*            <div className="trending__header">*/}
                    {/*                <h4>Trending in VietNam</h4>*/}
                    {/*                <IconButton aria-label="comment" >*/}
                    {/*                    <MoreHorizOutlinedIcon />*/}
                    {/*                </IconButton>*/}
                    {/*            </div>*/}
                    {/*            <div className="trending__name">*/}
                    {/*                <h3>Healthy</h3>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div role="button" className="padding-20 show-more">*/}
                    {/*        <span className="">Show more</span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <div className="suggest__container sideBar__containerBlock">
                        <div className="suggest__header padding-20 bottomDivider">
                            <h2>Who to follow</h2>
                        </div>
                        {
                            users ? (users.map(({id, opponent}) => (
                                <div key={id} className="suggest__content  bottomDivider">
                                    <CardHeader className="suggest__user"
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
                                <span className="">Show more</span>
                            </Link>

                        </div>
                    </div>

                </div>
            </div>
        </Hidden>


    )
}

export default RightSideBar;