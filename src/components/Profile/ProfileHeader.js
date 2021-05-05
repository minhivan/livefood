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
import {checkMyFollowingList} from "../../hooks/services";
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
        marginLeft: "50px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        alignItems: "center"
    },
    bioAvt: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        alignItems: "flex-start",
        paddingTop: "10px"
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
        marginRight: "15px",
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
        padding: "20px 0"
    },
}));


const ProfileHeader = ({isAuthProfile, userSnapshot, count, userLogged, authFollowingList,  ...rest}) => {

    const [userFollowing, setUserFollowing] = useState([]);
    const [userFollower, setUserFollower] = useState([]);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('');


    const handleOpenPopUp = (data, type) => {
        setData(data);
        setType(type);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setData(null);
        setType('')
    }

    // Your data


    useEffect(() => {
        if(typeof userSnapshot?.follower !== 'undefined' && userSnapshot?.follower?.length > 0){
            db.collection("users")
                .where(firebase.firestore.FieldPath.documentId(), 'in', userSnapshot.follower)
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
                .where(firebase.firestore.FieldPath.documentId(), 'in', userSnapshot.following)
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


    const classes = useStyles();
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
                            isAuthProfile ? (
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
                                userLogged ? (
                                    <div className="share-follow-container">
                                        {/* Checking if followed */}
                                        {
                                            checkMyFollowingList(authFollowingList, userSnapshot.uid) ? (
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
                                                        onClick={() => handleUserFollow(userLogged.uid, userSnapshot.uid)}
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
                                ) : null
                            )
                        }

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
                                    <Divider />
                                    <h4 className={classes.opening}>
                                        <AccessTimeRoundedIcon style={{marginRight: "5px"}}/>
                                        Opening:
                                        <span style={{marginLeft: "5px"}}>
                                            {userSnapshot?.aboutRestaurant?.opening} - {userSnapshot?.aboutRestaurant?.closed}
                                        </span>
                                    </h4>
                                    <Divider />
                                </>

                            ) : null
                        }

                        {/* Count info */}
                        <h2 className="count-infos">
                            <div className="number"><strong title="Likes">{ count ?? '0'}</strong><span
                                className="unit">Post</span></div>
                            <div className="number"><strong title="Following">{userFollowing.length}</strong><a className="unit" onClick={() => handleOpenPopUp(userFollowing, 1)}>Following</a></div>
                            <div className="number"><strong title="Followers">{userFollower.length}</strong><a className="unit" onClick={() => handleOpenPopUp(userFollower, 2)}>Follower</a></div>
                        </h2>
                    </div>
                </div>

            </div>
            <ListUserInProfile open={open} handleClose={handleClose} data={data} type={type} userLogged={userLogged} authFollowingList={authFollowingList}/>
        </div>
    )
}

export default ProfileHeader