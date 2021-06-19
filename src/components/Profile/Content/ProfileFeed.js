import React, {useEffect, useState} from "react";
// import {useAuthState} from "react-firebase-hooks/auth";
import { db} from "../../../firebase";
import ExploreItem from "../../Explore/ExploreItem";
import {makeStyles} from "@material-ui/core/styles";
import {Camera as CameraIcon, Video as VideoIcon} from "react-feather";
import Button from "@material-ui/core/Button";
import AlertPopup from "../../Popup/AlertPopup";
import Popup from "../../Upload/Popup";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
// import {useDocument} from "react-firebase-hooks/firestore";

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
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid rgb(1 1 1 / 15%)",

    },
    input: {
        display: "none"
    },
}));




const ProfileFeed = ({uid, userLogged}) => {
    const classes = useStyles();
    const [feed, setFeed] = useState(null);
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [openSnack, setOpenSnack] = useState(false);
    const [toggle, setToggle] = useState(false);


    const handleCloseAlert = () => {
        setOpenAlert(false);
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseSnack = (event) => {
        setOpenSnack(false);
    };


    useEffect(() => {
        if(openSnack) {
            setToggle(prevState => !prevState);
        }
    }, [openSnack])



    const handleChange = (event) => {
        const imageList = event.target.files;
        let conditions = ["image", "video"];
        const finalData = [];
        Array.from(imageList).forEach(file => {
            if(conditions.some(el => file['type'].split('/')[0].includes(el)) && (file.size / 1024 / 1024 < 10)){
                finalData.push(file)
            }
            else{
                setAlertMessage("File does not support or too large. Please upload again");
                setOpenAlert(true);
            }
        });
        if(finalData.length > 0){
            setImage(finalData);
        }
    }

    useEffect(() => {
        return db.collection('posts')
            .where('uid', '==', uid)
            // .where('type' , '!=' , 'video')
            // .orderBy('type')
            .orderBy('timestamp', 'desc')
            .get().then(snapshot => {
                let temp = []
                snapshot.forEach(data => {
                    let userProfile = {};
                    if(uid === userLogged?.uid){
                        data.data().user.get().then( author => {
                            Object.assign(userProfile, author.data());
                        })
                        temp.push({id: data.id, post: data.data(), postAuthor: userProfile })
                    }
                    else if(data.data()?.status !== "private"){
                        data.data().user.get().then( author => {
                            Object.assign(userProfile, author.data());
                        })
                        temp.push({id: data.id, post: data.data(), postAuthor: userProfile })
                    }
                })
                setFeed(temp);
            })

    }, [uid, toggle, userLogged?.uid]);


    return(
        <div className="explore__root" style={{paddingTop: "30px"}}>
            <input accept="image/*|video/*" type="file" multiple="multiple" onChange={handleChange} onClick={event => (event.target.value = null)} id="icon-button-file" className={classes.input}/>
            {
                feed && feed?.length > 0 ? (
                    <div className="explore__container" style={{padding: "0"}} >
                        {
                            userLogged && uid === userLogged?.uid ? (
                                <>
                                    <div className={classes.addMore}>
                                        <div className={classes.wrapper}>
                                            <div className={classes.none}>
                                                <CameraIcon
                                                    className={classes.icon}
                                                    size="40"
                                                />
                                            </div>
                                            <h2 style={{paddingBottom: "10px"}}>Sharing Your Moments</h2>
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
                            feed.map(({id, post, postAuthor}) => (
                                <ExploreItem
                                    key={id}
                                    postId={id}
                                    post={post}
                                    postAuthor={postAuthor}
                                    userLogged={userLogged}
                                />
                            ))
                        }
                    </div>
                ) : (
                    <div className={classes.wrapper}>
                        <div className={classes.none}>
                            <CameraIcon
                                className={classes.icon}
                                size="40"
                            />
                        </div>
                        {
                            userLogged && uid === userLogged?.uid ? (
                                <>
                                    <h2 style={{paddingBottom: "10px"}}>Sharing your moments</h2>

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
                                <h2 style={{paddingBottom: "10px"}}>No posts found</h2>
                            )
                        }
                    </div>
                )
            }

            {
                open ? (
                    <Popup open={open} image={image}  handleClose={handleClose} setImage={setImage} setOpenSnack={setOpenSnack}/>
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

export default ProfileFeed