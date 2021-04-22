import React, {useEffect, useState} from "react";
// import {useAuthState} from "react-firebase-hooks/auth";
import { db} from "../../../firebase";
import ExploreItem from "../../Explore/ExploreItem";
import {makeStyles} from "@material-ui/core/styles";
import {Camera as CameraIcon} from "react-feather";

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




const ProfileFeed = ({uid}) => {
    const classes = useStyles();
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        window.scroll({top: 0, left: 0, behavior: 'smooth' });

        let postDoc = db.collection('posts');
        postDoc
            .where('uid', "==", uid)
            .orderBy('timestamp', 'desc')
            .limit(12)
            .get().then(snapshot => {
            let temp = []
                snapshot.forEach(data => {
                    var userProfile = {};

                    data.data().user.get().then( author => {
                        Object.assign(userProfile, author.data());
                    })
                    temp.push({id: data.id, post: data.data(), authorProfile: userProfile })
                })
                setFeed(temp);
            })
    }, [uid]);

    return(
        <div className="explore__root" style={{paddingTop: "20px"}}>
            <div className="explore__container">
                {
                    feed.length > 0 ? (
                        feed.map(({id, post, authorProfile}) => (
                            <ExploreItem key={id} id={id} post={post} postAuthor={authorProfile} />
                        ))
                    ) : (
                        <div className={classes.wrapper}>
                            <div className={classes.none}>
                                <CameraIcon
                                    className={classes.icon}
                                    size="40"
                                />
                            </div>
                            <h2 style={{paddingBottom: "10px"}}>No Posts Yet</h2>

                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default ProfileFeed