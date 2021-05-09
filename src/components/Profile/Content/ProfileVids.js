import React, {useEffect, useState} from "react";
// import {useAuthState} from "react-firebase-hooks/auth";
import {db} from "../../../firebase";
import {Video as VideoIcon} from "react-feather";
import {makeStyles} from "@material-ui/core/styles";
import ExploreItem from "../../Explore/ExploreItem";
// import {useCollection} from "react-firebase-hooks/firestore";


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

const ProfileVids = ({uid, userLogged}) => {
    const classes = useStyles();
    const [vid, setVid] = useState([]);

    useEffect(() => {
        window.scroll({top: 0, left: 0, behavior: 'smooth' });

        let postDoc = db.collection('posts');
        return postDoc
            .where('uid', "==", uid)
            .where('mediaType', '==', 'video/mp4')
            .orderBy('timestamp', 'desc')
            .limit(12)
            .get().then(snapshot => {
                let temp = []
                snapshot.forEach(data => {
                    var authorVid = {};
                    data.data().user.get().then( author => {
                        Object.assign(authorVid, author.data());
                    })
                    temp.push({id: data.id, post: data.data(), authorVid: authorVid })
                })
                setVid(temp);
            })
    }, [uid]);

    return(
        <div className="explore__root" style={{paddingTop: "20px"}}>
            <div className="explore__container">
                {
                    vid.length > 0 ? (
                        vid.map(({id, post, authorVid}) => (
                            <ExploreItem
                                key={id}
                                postId={id}
                                post={post}
                                postAuthor={authorVid}
                                userLogged={userLogged}
                            />
                        ))
                    ) : (
                        <div className={classes.wrapper}>
                            <div className={classes.none}>
                                <VideoIcon
                                    className={classes.icon}
                                    size="40"
                                />
                            </div>
                            <h2 style={{paddingBottom: "10px"}}>Start Record Video</h2>
                            <p>No videos found.</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ProfileVids