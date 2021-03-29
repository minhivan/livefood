import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Skeleton from '@material-ui/lab/Skeleton';
import {Link} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import {Badge} from "@material-ui/core";
import ExploreTwoToneIcon from "@material-ui/icons/ExploreTwoTone";


const useStyles = makeStyles((theme) => ({
    userPhoto: {
        width: "120px",
        height: "120px"
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
    }
}));


const ProfileHeader = ({isAuthProfile,user, ...rest}) => {
    const classes = useStyles();

    return (
        <div className="profile__header">
            <div className="profile__bio">
                <div className={classes.bioAvt}>
                    {
                        user? (
                                <Avatar alt="Remy Sharp" src={user.photoURL} className={classes.userPhoto}/>
                        ): (
                            <Skeleton animation="wave" variant="circle" width={120} height={120} />
                        )
                    }

                </div>
                <div className={classes.bioDetails}>
                    <div className="share-title-container">
                        {/* User bio */}
                        <h2 className="share-title">{user?.displayName}</h2>
                        <h1 className="share-sub-title">Full Name</h1>
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
                                <div className="share-follow-container">
                                    {/* Checking if followed */}

                                    <Button
                                        variant="contained"
                                        className={classes.button}
                                    >
                                        Followed
                                    </Button>

                                    <Button
                                        variant="contained"
                                        className={classes.button}
                                    >
                                        Message
                                    </Button>
                                </div>
                            )
                        }


                        <h2 className="share-desc mt10">
                            "Welcome to my blogggg"
                        </h2>

                        <div className="share-links">
                            <a href="https://www.tiktok.com/link/v2?aid=1988&amp;lang=en&amp;scene=bio_url&amp;target=youtube.com%2Fc%2Fhauhoang">youtube.com/c/hauhoang</a>
                        </div>


                        {/* Count info */}
                        <h2 className="count-infos">
                            <div className="number"><strong title="Likes">12</strong><span
                                className="unit">Post</span></div>
                            <div className="number"><strong title="Following">1</strong><span
                                className="unit">Following</span></div>
                            <div className="number"><strong title="Followers">4.9M</strong><span
                                className="unit">Followers</span></div>
                        </h2>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default ProfileHeader