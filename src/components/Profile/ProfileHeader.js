import React, {useEffect, useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Skeleton from '@material-ui/lab/Skeleton';
import {Link} from "react-router-dom";
import {db} from "../../firebase";
import {handleUserFollow, handleUserUnfollow} from "../../hooks/services";
import AccessTimeRoundedIcon from '@material-ui/icons/AccessTimeRounded';
import { blue } from '@material-ui/core/colors';
import firebase from "firebase";
import Divider from "@material-ui/core/Divider";
import ListUserInProfile from "../Popup/ListUserInProfile";
import LocationOnRoundedIcon from '@material-ui/icons/LocationOnRounded';
import {useDocument} from "react-firebase-hooks/firestore";
import MapRoundedIcon from '@material-ui/icons/MapRounded';
import OpenRating from "../Popup/OpenRating";
import {Rating} from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: "16px",
    },
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    userPhoto: {
        width: "120px",
        height: "120px",
        backgroundColor: blue[100],
        color: blue[600],
    },
    bioDetails: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        alignItems: "center",
        // flex: "1"
    },
    bioAvt: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        alignItems: "flex-start",
    },
    button: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "150px",
        color: "white",
        backgroundColor: "#0095f6",
        "&:hover": {
            backgroundColor: "#0186db",
        },
        textTransform: "capitalize"
    },
    buttonUnfollow: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "150px",
        color: "#454444",
        // "&:hover": {
        //     backgroundColor: "#c3d6fa",
        // },
        marginRight: "15px",
        textTransform: "capitalize"
    },
    displayName: {
        maxWidth: "120px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        display: "inline-block"
    },
    opening: {
        display: "flex",
        alignItems: "center",
        color: "#65676B",
    },
    about: {
        padding: "20px 0",
        display: "flex",
        gap: "10px"
    },
    bioContent: {
        padding: "20px 0"
    },
    voteRating : {
        display: "flex",
        alignItems: "center",
        paddingBottom: "15px"
    }
}));


const ProfileHeader = ({isAuthProfile, userSnapshot, count, userLogged,  ...rest}) => {
    const classes = useStyles();
    const [userFollowing, setUserFollowing] = useState([]);
    const [userFollower, setUserFollower] = useState([]);
    const [openFollower, setOpenFollower] = useState(false);
    const [openFollowing, setOpenFollowing] = useState(false);
    const [openRating, setOpenRating] = useState(false);
    const [authData] = useDocument(userLogged && db.collection('users').doc(userLogged.uid));
    const authFollowingList = authData?.data()?.following;
    const [userLoggedData, setUserLoggedData] = useState({});


    const handleOpenRating = () => {
        setOpenRating(true);
    }

    const handleCloseRating = () => {
        setOpenRating(false);
    }

    const handleOpenFollower = () => {
        setOpenFollower(true);
    }

    const handleCloseFollower = () => {
        setOpenFollower(false);
    }

    const handleOpenFollowing = () => {
        setOpenFollowing(true);
    }

    const handleCloseFollowing = () => {
        setOpenFollowing(false);
    }

    const handleLoadMore = (type, length) => {
        if(type === `1`){
            return db.collection("users")
                .where(firebase.firestore.FieldPath.documentId(), 'in', userSnapshot.following.slice(length,length+9))
                .get().then(snapshot => {
                    const temp = snapshot.docs.map((doc => ({
                        id: doc.id,
                        data: doc.data(),
                    })))

                    setUserFollowing([...userFollowing, ...temp]);
                })
        }
        else{
            return db.collection("users")
                .where(firebase.firestore.FieldPath.documentId(), 'in', userSnapshot.follower.slice(length,length+9))
                .get().then(snapshot => {
                    const temp = snapshot.docs.map((doc => ({
                        id: doc.id,
                        data: doc.data(),
                    })))

                    setUserFollower([...userFollower, ...temp]);
                })
        }
    }

    useEffect(() => {
        if(userLogged){
            setUserLoggedData({
                uid: userLogged.uid,
                photoURL: userLogged.photoURL,
                displayName: userLogged.displayName
            })
        }
    }, [userLogged])

    // Your data
    useEffect(() => {
        if(typeof userSnapshot?.follower !== 'undefined' && userSnapshot?.follower?.length > 0){
            db.collection("users")
                .where(firebase.firestore.FieldPath.documentId(), 'in', userSnapshot.follower.slice(0,9))
                .get().then(snapshot => {
                setUserFollower(
                    snapshot.docs.map((doc => ({
                        id: doc.id,
                        data: doc.data(),
                    })))
                );
            })
        }
        if(typeof userSnapshot?.following !== 'undefined' && userSnapshot?.following?.length > 0){

            db.collection("users")
                .where(firebase.firestore.FieldPath.documentId(), 'in', userSnapshot.following.slice(0,9))
                .get().then(snapshot => {
                setUserFollowing(
                    snapshot.docs.map((doc => ({
                        id: doc.id,
                        data: doc.data(),
                    })))
                );
            })
        }

    }, [userSnapshot])


    return (
        <div className="profile__header">
            <div className="profile__bio">
                <div className={classes.bioAvt}>
                    {
                        userSnapshot? (
                            <Avatar alt={userSnapshot?.displayName} src={userSnapshot?.photoURL} className={classes.userPhoto}/>
                        ): (
                            <Skeleton animation="wave" variant="circle" width={120} height={120} />
                        )
                    }

                </div>
                <div className={classes.bioDetails}>
                    <div className="share-title-container">
                        {/* User bio */}
                        <h2 className="share-title">{userSnapshot?.displayName}</h2>
                        <h1 className="share-sub-title">{userSnapshot?.fullName ?? ''}</h1>
                        {
                            userLogged ? (
                                userSnapshot?.uid === userLogged.uid ? (
                                    <div className="share-follow-container">
                                        {/* Checking if followed */}
                                        <Link to="/account/edit">
                                            <Button
                                                variant="contained"
                                                className={classes.button}
                                            >
                                                Edit profile
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="share-follow-container">
                                        {/* Checking if followed */}
                                        {
                                            userSnapshot?.follower?.includes(userLogged.uid) ? (
                                                <Button
                                                    variant="outlined"
                                                    className={classes.buttonUnfollow}
                                                    onClick={() => handleUserUnfollow(userLogged.uid, userSnapshot.uid)}
                                                >
                                                    Unfollow
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    className={classes.button}
                                                    onClick={() => handleUserFollow(userLoggedData, userSnapshot.uid)}
                                                >
                                                    Follow
                                                </Button>
                                            )
                                        }
                                        <Button
                                            variant="contained"
                                            className={classes.button}
                                        >
                                            Message
                                        </Button>

                                    </div>
                                )
                            ) : null
                        }

                    </div>
                </div>
            </div>

            <div className="profile__about">
                <div className={classes.countInfo}>
                    <Divider />
                    {/* Count info */}
                    <h2 className="count-infos">
                        <div className="number"><strong title="Likes">{ count ?? '0'}</strong><span
                            className="unit">Post</span></div>
                        <div className="number"><strong title="Following">{userSnapshot?.followingCount ?? "0"}</strong><a className="unit" onClick={handleOpenFollowing}>Following</a></div>
                        <div className="number"><strong title="Followers">{userSnapshot?.followerCount ?? "0"}</strong><a className="unit" onClick={handleOpenFollower}>Follower</a></div>
                    </h2>
                    <Divider />
                </div>
                <div className={classes.bioContent}>
                    {
                        userSnapshot?.bio ? (
                            <h2 className="share-desc mt10">
                                {userSnapshot.bio}
                            </h2>
                        ) : null
                    }
                    {
                        userSnapshot?.profileLink ? (
                            <div className="share-links">
                                <a href={userSnapshot.profileLink}>{userSnapshot.profileLink}</a>
                            </div>
                        ) : null
                    }
                    {
                        userSnapshot?.aboutRestaurant ? (
                            <>
                                <div className={classes.about}>
                                    {
                                        userSnapshot?.aboutRestaurant?.opening ? (
                                            <h4 className={classes.opening}>
                                                <AccessTimeRoundedIcon style={{marginRight: "5px"}}/>
                                                Opening :
                                                <span style={{marginLeft: "5px"}}>{userSnapshot?.aboutRestaurant?.opening} - {userSnapshot?.aboutRestaurant?.closed}</span>
                                            </h4>
                                        ) : null
                                    }
                                    {
                                        userSnapshot?.aboutRestaurant?.location ? (
                                            <h4 className={classes.opening}>
                                                <LocationOnRoundedIcon style={{marginRight: "5px"}}/>
                                                Location :
                                                <span style={{marginLeft: "5px"}}>{userSnapshot?.aboutRestaurant?.location}</span>
                                            </h4>
                                        ) : null
                                    }
                                </div>
                                {
                                    userSnapshot?.aboutRestaurant?.address ? (
                                        <h4 className={classes.opening} style={{paddingBottom: "20px"}}>
                                            <MapRoundedIcon style={{marginRight: "5px"}}/>
                                            Address :
                                            <span style={{marginLeft: "5px"}}>{userSnapshot?.aboutRestaurant?.address}</span>
                                        </h4>
                                    ) : null
                                }
                            </>
                        ) : null
                    }
                    {
                        userSnapshot?.voteRating ? (
                            <div className={classes.voteRating}>
                                <Rating name="read-only" value={userSnapshot?.voteRating} precision={0.1} readOnly />
                                <span style={{paddingLeft: "5px"}}> {userSnapshot?.voteCount} reviews from LiveFood</span>
                            </div>
                        ) : null
                    }
                    <Divider />
                </div>


                {
                    userLogged ? (
                        userSnapshot?.accountType === "foodshop" && userLogged.uid !== userSnapshot?.uid ? (
                            <Button
                                style={{width: "150px", margin: "auto"}}
                                variant="contained"
                                className={classes.button}
                                onClick={handleOpenRating}
                            >
                                Vote
                            </Button>
                        ) : null
                    ) : null
                }

            </div>
            {
                openFollowing ? (
                    <ListUserInProfile open={openFollowing} handleClose={handleCloseFollowing} data={userFollowing} type={`1`} userLogged={userLogged} authFollowingList={authFollowingList} countUser={userSnapshot?.followingCount} handleLoadMore={handleLoadMore}/>
                ) : null
            }
            {
                openFollower ? (
                    <ListUserInProfile open={openFollower} handleClose={handleCloseFollower} data={userFollower} type={`2`} userLogged={userLogged} authFollowingList={authFollowingList} countUser={userSnapshot?.followerCount} handleLoadMore={handleLoadMore}/>
                ) : null
            }
            {
                openRating ? (
                    <OpenRating open={openRating} handleClose={handleCloseRating} userLogged={userLogged} shopId={userSnapshot?.uid} voteRating={userSnapshot?.voteRating}/>
                ) : null
            }
        </div>
    )
}

export default ProfileHeader;