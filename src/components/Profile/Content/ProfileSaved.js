import React, {useEffect, useState} from "react";
// import {useAuthState} from "react-firebase-hooks/auth";
// import {db} from "../../../firebase";
import {Bookmark as BookmarkIcon} from "react-feather";
import {makeStyles} from "@material-ui/core/styles";
import {db} from "../../../firebase";
import {useDocument} from "react-firebase-hooks/firestore";
import firebase from "firebase";
import ExploreItem from "../../Explore/ExploreItem";


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

const ProfileSaved = ({uid, userLogged}) => {
    const classes = useStyles();
    const [savedPost, setSavedPost] = useState([]);

    const userRef = db.collection('users').doc(uid);
    const [userSnapshot] = useDocument(userRef);

    let userSavedList = userSnapshot?.data()?.postSave;

    useEffect(() => {
        window.scroll({top: 0, left: 0, behavior: 'smooth' });

        if(typeof userSavedList !== 'undefined'){
            if(userSavedList.length > 0){
                db.collection('posts')
                    .where(firebase.firestore.FieldPath.documentId(), 'in', userSavedList)
                    .limit(12)
                    .get().then(async snapshot => {
                        let temp = []
                        snapshot.forEach(data => {
                            var userProfile = {};
                            data.data().user.get().then( author => {
                                Object.assign(userProfile, author.data());
                            })
                            temp.push({id: data.id, post: data.data(), authorProfile: userProfile })
                        })
                        setSavedPost(temp);
                    })
            }
        }
    }, [userSavedList?.length]);

    return(
        <div className="explore__root" style={{paddingTop: "20px"}}>
            <div className="explore__container" style={{padding: "0"}}>
                {
                    savedPost.length > 0 ? (
                        savedPost.map(({id, post, authorProfile}) => (
                            <ExploreItem
                                key={id}
                                postId={id}
                                post={post}
                                postAuthor={authorProfile}
                                userLogged={userLogged}
                            />
                        ))
                    ) : (
                        <div className={classes.wrapper}>
                            <div className={classes.none}>
                                <BookmarkIcon
                                    className={classes.icon}
                                    size="40"
                                />
                            </div>
                            <h2 style={{paddingBottom: "10px"}}>Start Saving</h2>
                            <p>Save photos and videos to your collection.</p>
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default ProfileSaved