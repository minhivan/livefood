import React, {useEffect, useState} from "react";
// import {useAuthState} from "react-firebase-hooks/auth";
import {db} from "../../../firebase";
import {Video as VideoIcon} from "react-feather";
import {makeStyles} from "@material-ui/core/styles";
import ExploreItem from "../../Explore/ExploreItem";
import Button from "@material-ui/core/Button";
import AddVideo from "../../Upload/AddVideo";
import AlertPopup from "../../Popup/AlertPopup";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
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
        boxShadow: "0px 0px 5px 0px #a09494bf",
    },
    input: {
        display: "none"
    },

}));

const ProfileVideo = ({uid, userLogged, userSnapshot}) => {
    const classes = useStyles();
    const [vid, setVid] = useState([]);
    const [open, setOpen] = useState(false);
    const [videoUpload, setVideoUpload] = useState('');
    // const [userSnapshot, loading] = useDocument(userLogged.uid && db.collection("users").doc(userLogged.uid));
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [openSnack, setOpenSnack] = useState(false);
    const [toggle, setToggle] = useState(false);


    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    }

    const handleCloseSnack = (event) => {
        setOpenSnack(false);
    };

    useEffect(() => {
        if(openSnack) {
            setToggle(prevState => !prevState);
        }
    }, [openSnack])



    const handleChange = (event) => {
        const video = event.target.files;
        if(video[0].type.split('/')[0].includes("video") && (video[0].size / 1024 /1024 < 10)){
            setVideoUpload(video[0]);
            setOpen(true);
        }
        else{
            setAlertMessage("File does not support or too large. Please upload again");
            setOpenAlert(true);
        }
    }

    useEffect(() => {
        return  db.collection('posts')
            .where('uid', "==", uid)
            .where('type', '==', 'video')
            .orderBy('timestamp', 'desc')
            .limit(12)
            .get().then(snapshot => {
                let temp = []
                snapshot.forEach(data => {
                    let authorVid = {};
                    data.data().user.get().then( author => {
                        Object.assign(authorVid, author.data());
                    })
                    temp.push({id: data.id, post: data.data(), authorVid: authorVid })
                })
                setVid(temp);
            })

    }, [uid, toggle]);

    return(
        <div className="explore__root" style={{paddingTop: "30px"}}>
            <input accept="video/*" type="file" onChange={handleChange} onClick={event => (event.target.value = null)} id="video-upload" className={classes.input}/>

            {
                vid.length > 0 ? (
                    <div className="explore__container" style={{padding: "0"}}>
                        {
                            uid === userLogged.uid ? (
                                <>
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
                                </>
                            ) : null
                        }
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
                            userLogged && uid === userLogged?.uid ? (
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
                        }
                    </div>
                )
            }
            {
                open ? (
                    <AddVideo open={open} videoUpload={videoUpload}  handleClose={handleClose} setVideoUpload={setVideoUpload} setOpenSnack={setOpenSnack} />
                ) : null
            }
            {
                openAlert ? (
                    <AlertPopup open={openAlert} handleClose={handleCloseAlert} title="LiveFood" message={alertMessage}/>
                ) : null
            }
            {
                openSnack ? (
                    <Snackbar
                        open={openSnack}
                        autoHideDuration={6000}
                        onClose={handleCloseSnack}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Alert variant="filled" onClose={handleCloseSnack} severity="success">
                            Upload successfully !
                        </Alert>
                    </Snackbar>
                ) : null
            }
        </div>
    )
}

export default ProfileVideo