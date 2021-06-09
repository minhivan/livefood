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
import RecommendRating from "../Popup/RecommendRating";
import {Rating} from "@material-ui/lab";
// import Typography from "@material-ui/core/Typography";
import LinkTwoToneIcon from '@material-ui/icons/LinkTwoTone';
import EmojiFoodBeverageTwoToneIcon from '@material-ui/icons/EmojiFoodBeverageTwoTone';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';


import {
    Coffee as CoffeeIcon,
    Instagram as InstagramIcon,
    Video as VideoIcon
} from "react-feather";
import {Tooltip} from "@material-ui/core";

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
        color: "#000",
        fontWeight: "500",
        cursor : "pointer",

    },
    about: {
        padding: "20px 0 0",
        display: "block",
        gap: "10px"
    },
    bioContent: {
        padding: "20px"
    },
    voteRating : {
        display: "flex",
        alignItems: "center",
        paddingTop: "15px"
    },
    viewMoreRating: {
        paddingLeft: "5px",
        color: "#0290e0",
        "&:hover": {
            color: "#03639e",
            transition: "0.2s all ease",
        },
    },
    countInfo: {
        display: "block",
        color: "rgba(18,18,18,0.75)"
    },
    linkToAbout: {
        display: "flex",
        alignItems: "center",
        color: "#000",
        cursor : "pointer",

    },
    buttonClose: {
        position: "absolute",
        right: "20px",
        top: "10px"
    },
    icon: {
        color: "#050505"
    },
}));


const ProfileHeader = ({userSnapshot, count, userLogged}) => {
    const classes = useStyles();
    const [userFollowing, setUserFollowing] = useState([]);
    const [userFollower, setUserFollower] = useState([]);
    const [openFollower, setOpenFollower] = useState(false);
    const [openFollowing, setOpenFollowing] = useState(false);
    const [openRating, setOpenRating] = useState(false);
    const [authData] = useDocument(userLogged && db.collection('users').doc(userLogged.uid));
    const authFollowingList = authData?.data()?.following;
    const [userLoggedData, setUserLoggedData] = useState({});
    const [isReadMore, setIsReadMore] = useState(true);

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

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
                            temp: {
                                photoURL: doc.data()?.photoURL,
                                displayName: doc.data()?.displayName
                            }
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
                        <h2 className="share-title">
                            {userSnapshot?.displayName}
                            {
                                userSnapshot?.accountVerified ? (
                                    <Tooltip title="Verified" arrow>
                                        <CheckCircleTwoToneIcon style={{ color: blue[700], marginLeft: "5px"}}/>
                                    </Tooltip>
                                ) : null
                            }
                        </h2>
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
                                            component={Link}
                                            to={`/messages`}
                                            variant="contained"
                                            className={classes.button}
                                        >
                                            Message
                                        </Button>
                                        {
                                            userSnapshot?.accountType === "foodshop" && userLogged ? (
                                                <Button
                                                    variant="contained"
                                                    className={classes.button}
                                                    onClick={handleOpenRating}
                                                >
                                                    Rating
                                                </Button>
                                            ) : null
                                        }
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
                            <h2 className="share-desc mt10" style={{textAlign: "center"}}>
                                {/*{userSnapshot.bio}*/}
                                {
                                    userSnapshot.bio?.length > 150 ? (
                                        <>
                                            {isReadMore ? userSnapshot.bio.slice(0, 150) : userSnapshot.bio}
                                            <span onClick={toggleReadMore} style={{fontWeight: "bold", cursor: "pointer", color: "#8e8e8e"}}>
                                                {isReadMore ? "...read more" : null}
                                            </span>
                                        </>
                                    ) : userSnapshot.bio
                                }
                            </h2>
                        ) : null
                    }
                    {
                        userSnapshot?.profileLink ? (
                            <div className="share-links">
                                <LinkTwoToneIcon style={{marginRight: "5px"}}/><a href={userSnapshot.profileLink} target="_blank">{userSnapshot.profileLink}</a>
                            </div>
                        ) : null
                    }

                    {
                        userSnapshot?.accountType === "foodshop" && userSnapshot?.aboutRestaurant ? (
                            <>
                                {
                                    userSnapshot?.voteRating ? (
                                        <div className={classes.voteRating}>
                                            <Rating name="read-only" value={userSnapshot?.voteRating} precision={0.1} readOnly size="small"/>
                                            <Link to={`/profile/vote/${userSnapshot?.uid}`}>
                                                <span  className={classes.viewMoreRating}> {userSnapshot?.voteCount} reviews from LiveFood</span>
                                            </Link>
                                        </div>
                                    ) : null
                                }
                                <div className={classes.about}>
                                    {
                                        userSnapshot?.accountType === "foodshop" ? (
                                            <div style={{display: "flex"}}>
                                                <h4 className={classes.opening} style={{paddingBottom: "20px"}}>
                                                    <EmojiFoodBeverageTwoToneIcon />
                                                    <span style={{marginLeft: "5px", marginRight: "10px"}}> {userSnapshot?.aboutRestaurant?.model}</span>
                                                </h4>
                                                {
                                                    userSnapshot?.aboutRestaurant?.opening ? (
                                                        <h4 className={classes.opening} style={{paddingBottom: "20px"}}>
                                                            <AccessTimeRoundedIcon style={{marginRight: "5px"}}/>
                                                            Opening :
                                                            <span style={{marginLeft: "5px"}}>{userSnapshot?.aboutRestaurant?.opening} - {userSnapshot?.aboutRestaurant?.closed}</span>
                                                        </h4>
                                                    ) : null
                                                }
                                            </div>
                                        ) : null
                                    }

                                    {
                                        userSnapshot?.aboutRestaurant?.address ? (
                                            <h4 className={classes.opening} style={{paddingBottom: "20px"}}>
                                                <MapRoundedIcon style={{marginRight: "5px"}}/>
                                                <div className={classes.content}>
                                                    <span>Address :</span>
                                                    <span style={{marginLeft: "5px"}}>{userSnapshot?.aboutRestaurant?.address}</span>
                                                    {
                                                        userSnapshot?.aboutRestaurant?.location ? (
                                                            <span > - {userSnapshot?.aboutRestaurant?.location}</span>
                                                        ) : null
                                                    }
                                                </div>
                                            </h4>
                                        ) : null
                                    }
                                    {
                                        userSnapshot?.aboutRestaurant?.geolocation ? (
                                            <h4 className={classes.opening} style={{color: ""}}>
                                                <Link to={`/profile/about/${userSnapshot?.uid}`} className={classes.linkToAbout}>
                                                    <LocationOnRoundedIcon />
                                                    <span style={{marginLeft: "5px"}}>Find on map</span>
                                                </Link>
                                            </h4>
                                        ) : null
                                    }
                                </div>

                            </>
                        ) : null
                    }
                </div>

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
                    <RecommendRating open={openRating} handleClose={handleCloseRating} userLogged={userLogged} shopId={userSnapshot?.uid} voteRating={userSnapshot?.voteRating}/>
                ) : null
            }
            {
                userSnapshot?.accountType === "foodshop" ? (
                    <div className={classes.buttonClose}>
                        <CoffeeIcon
                            className={classes.icon}
                            size="40"
                        />
                    </div>
                ) : (
                    userSnapshot?.accountType === "reviewer" ? (
                        <div className={classes.buttonClose}>
                            <VideoIcon
                                className={classes.icon}
                                size="40"
                            />
                        </div>
                    ) : (
                        <div className={classes.buttonClose}>
                            <InstagramIcon
                                className={classes.icon}
                                size="40"
                            />
                        </div>
                    )
                )
            }

        </div>
    )
}

export default ProfileHeader;