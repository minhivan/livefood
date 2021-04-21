import React, {useEffect, useState} from "react";
import '../RightSideBar.css';


import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import IconButton from "@material-ui/core/IconButton";
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import Avatar from "@material-ui/core/Avatar";
// import dayjs from "dayjs";
import CardHeader from "@material-ui/core/CardHeader";
import {Button, Hidden, makeStyles} from "@material-ui/core";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../../firebase";
import {useDocument} from "react-firebase-hooks/firestore";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 290,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));


function RightSideBar(props) {
    const classes = useStyles();
    const [users, setUsers] = useState([])
    const [userData] = useAuthState(auth);

    const userRef = db.collection('users').doc(userData.uid);
    const [userSnapshot] = useDocument(userRef);


    // List user
    useEffect(() => {
        var followingList;

        if(typeof userSnapshot?.data()?.following !== 'undefined' && userSnapshot?.data()?.following.length >= 0){
            followingList = userSnapshot.data().following
            followingList.push(userData.uid);
            return db.collection("users")
                .where('uid' ,'not-in' , followingList )
                .limit(4)
                .get().then(snapshot => {
                    setUsers(snapshot.docs.map(doc => ({
                        id: doc.id,
                        user: doc.data(),
                    })));
                })
        }
    }, [userSnapshot])



    return(
        <Hidden mdDown>
            <div className="app__rightSideBar">
                <div className="sideBar__container">
                    <div className="trending__container sideBar__containerBlock">
                        <div className="trending__header bottomDivider padding-10-20">
                            <h2>What's fresh?</h2>
                            <IconButton aria-label="comment" >
                                <SettingsOutlinedIcon />
                            </IconButton>
                        </div>
                        <div className="trending__content padding-10-20 bottomDivider">
                            <div className="trending__contentBlock">
                                <div className="trending__header">
                                    <h4>Trending in VietNam</h4>
                                    <IconButton aria-label="comment" >
                                        <MoreHorizOutlinedIcon />
                                    </IconButton>
                                </div>
                                <div className="trending__name">
                                    <h3>Healthy</h3>
                                </div>
                            </div>
                        </div>
                        <div className="trending__content padding-10-20 bottomDivider">
                            <div className="trending__contentBlock">
                                <div className="trending__header">
                                    <h4>Trending in VietNam</h4>
                                    <IconButton aria-label="comment" >
                                        <MoreHorizOutlinedIcon />
                                    </IconButton>
                                </div>
                                <div className="trending__name">
                                    <h3>Healthy</h3>
                                </div>
                            </div>
                        </div>
                        <div className="trending__content padding-10-20 bottomDivider">
                            <div className="trending__contentBlock">
                                <div className="trending__header">
                                    <h4>Trending in VietNam</h4>
                                    <IconButton aria-label="comment" >
                                        <MoreHorizOutlinedIcon />
                                    </IconButton>
                                </div>
                                <div className="trending__name">
                                    <h3>Healthy</h3>
                                </div>
                            </div>
                        </div>
                        <div role="button" className="padding-20 show-more">
                            <span className="">Show more</span>
                        </div>
                    </div>

                    <div className="suggest__container sideBar__containerBlock">
                        <div className="suggest__header padding-20 bottomDivider">
                            <h2>Who to follow</h2>
                        </div>
                        {
                            users && users?.map(({id, user}) => (
                                <div key={id} className="suggest__content  bottomDivider">
                                    <CardHeader className="suggest__user"
                                                avatar={
                                                    <Avatar aria-label={user.displayName} src={user.photoURL} />
                                                }
                                                title={
                                                    <Link to={`profile/${user.uid}`}>{user.displayName}</Link>
                                                }
                                                subheader={user.fullName}
                                    />

                                    <Button variant="outlined" color="primary" className="followBtn">
                                        Follow
                                    </Button>
                                </div>
                            ))
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