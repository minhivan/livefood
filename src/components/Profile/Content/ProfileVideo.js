import React, {useEffect, useState} from "react";
// import {useAuthState} from "react-firebase-hooks/auth";
import {db} from "../../../firebase";
import {Video as VideoIcon} from "react-feather";
import {makeStyles} from "@material-ui/core/styles";
import ExploreItem from "../../Explore/ExploreItem";
import Button from "@material-ui/core/Button";
import Popup from "../../Upload/Popup";
import AddVideo from "../../Upload/AddVideo";
import {useDocument} from "react-firebase-hooks/firestore";
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
    },
    addMore: {
        display: "flex",
        position: "relative",
        height: "auto",
        backgroundColor: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
    },
    input: {
        display: "none"
    },

}));

const ProfileVideo = ({uid, userLogged}) => {
    const classes = useStyles();
    const [vid, setVid] = useState([]);
    const [open, setOpen] = useState(false);
    const [videoUpload, setVideoUpload] = useState('');
    // const [userSnapshot, loading] = useDocument(userLogged.uid && db.collection("users").doc(userLogged.uid));


    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        if(event.target.files[0]){
            setVideoUpload(event.target.files[0]);
            setOpen(true)
        }
    }

    useEffect(() => {
        let postDoc = db.collection('posts');

        const unsubscribe =  postDoc
            .where('uid', "==", uid)
            .where('type', '==', 'video')
            .orderBy('timestamp', 'desc')
            .limit(12)
            .onSnapshot(snapshot => {
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
        return () => {
            unsubscribe();
        }
    }, [uid]);

    return(
        <div className="explore__root" style={{paddingTop: "20px"}}>
            <input accept="video/*" type="file" onChange={handleChange} onClick={e => (e.target.value = null)} id="video-upload" className={classes.input}/>
            {
                    vid.length > 0 ? (
                        <div className="explore__container" style={{padding: "0"}}>
                            <div className={classes.addMore}>
                                <div className={classes.wrapper}>
                                    <div className={classes.none}>
                                        <VideoIcon
                                            className={classes.icon}
                                            size="40"
                                        />
                                    </div>
                                    <h2 style={{paddingBottom: "10px"}}>Start Record Video</h2>
                                    <Button
                                        style={{textTransform: "capitalize", fontSize: "16px", marginTop: "20px"}}
                                        color="primary"
                                        variant="contained"
                                        onClick={handleOpen}
                                    >
                                        Upload
                                    </Button>
                                </div>
                            </div>
                            {
                                vid.map(({id, post, authorVid}) => (
                                    <ExploreItem
                                        key={id}
                                        postId={id}
                                        post={post}
                                        postAuthor={authorVid}
                                        userLogged={userLogged}
                                    />
                                ))
                            }
                        </div>
                    ) : (
                        <div className={classes.wrapper}>
                            <div className={classes.none}>
                                <VideoIcon
                                    className={classes.icon}
                                    size="40"
                                />
                            </div>
                            {
                                userLogged ? (
                                    uid === userLogged.uid ? (
                                        <>
                                            <h2 style={{paddingBottom: "10px"}}>Start Record Video</h2>
                                            <p>Videos must be between 1 and 60 minutes long.</p>
                                            <Button
                                                style={{textTransform: "capitalize", fontSize: "16px", marginTop: "20px"}}
                                                color="primary"
                                                variant="contained"
                                                onClick={handleOpen}
                                            >
                                                Upload
                                            </Button>
                                        </>
                                    ) : (
                                        <h2 style={{paddingBottom: "10px"}}>No videos found</h2>
                                    )
                                ) : (
                                    <h2 style={{paddingBottom: "10px"}}>No videos found</h2>
                                )
                            }
                        </div>
                    )
                }
            {
                open ? (
                    <AddVideo open={open} videoUpload={videoUpload}  handleClose={handleClose} setVideoUpload={setVideoUpload} />
                ) : null
            }
        </div>
    )
}

export default ProfileVideo