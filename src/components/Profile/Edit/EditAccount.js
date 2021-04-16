import React, {useEffect, useRef, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db, storage} from "../../../firebase";
import {makeStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import {Link} from "react-router-dom";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import {CircularProgress, IconButton, Modal, TextField} from "@material-ui/core";
// import {green} from "@material-ui/core/colors";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import Divider from "@material-ui/core/Divider";
import {useDocument} from "react-firebase-hooks/firestore";
import firebase from "firebase";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {green} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({

    avatar: {
        width: 100,
        height: 100,
        margin: "0 20px",
    },
    avatarHolder: {
        padding: "16px 32px"
    },
    holder: {
        display: "flex",
        padding: "16px"
    },
    changePhoto: {
        color: "#0095f6",
        padding: 0,
        textTransform: "capitalize"
    },
    displayName: {
        fontSize: 18
    },
    label: {
        flex: "0 0 25%",
        textAlign: "right",
        paddingTop: "5px"
    },
    input: {
        paddingLeft: 20,
        width: "60%",
        float: "left"
    },
    inputField: {
        width: "100%",
        padding: "0 8px",
        height: "32px",
        fontSize: "16px",
        color: "#262626",
        border: "1px solid rgba(var(--ca6,219,219,219),1)"

    },
    description: {
        padding: "10px 0"
    },
    descriptionText: {
        textOverflow: "ellipsis",
        textAlign: "justify",
        color: "#8e8e8e",
        fontSize: "12px",
    },
    inputText: {
        fontSize: "16px",
        height: 60,
        padding: "6px 10px",
        resize: "vertical",
        border: "1px solid rgba(var(--ca6,219,219,219),1)",
        width: "100%"
    },
    submit: {
        display: "flex",
        justifyContent: "center",
        padding: "20px"
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 3, 3),
        borderRadius: "8px",
        maxHeight: "300px",
        "&:focus": {
            outline: "none"
        },
        display: "flex",
        flexDirection: "column"
    },
    modalHeader: {
        display: "flex",
        justifyContent: "center",
        padding: "10px 0 20px 0",
    },
    btnAction: {
        display: "flex",
        justifyContent: "center",
    },
    buttonClose: {
        position: "fixed",
        right: "20px",
        top: "17px"
    },
    btnUpload: {
        color : "#0095f6",
        minHeight: "48px",
        width : "100%",
    },
    btnRemove: {
        color : "#d8102a",
        minHeight: "48px",
        width : "100%",
    },
    btnLabel: {
        fontWeight: "bold"
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

function getModalStyle() {
    const top = 50 ;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}


const EditAccount = () => {
    const [user] = useAuthState(auth);
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [modalStyle] = useState(getModalStyle);
    const hiddenFileInput = useRef(null);
    const [fullName, setFullName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [link, setLink] = useState('');
    const [bio, setBio] = useState('');
    const [phone, setPhone] = useState('');
    const [loadingAvt, setLoadingAvt] = useState(false);
    const [userData, loading] = useDocument(db.collection("users").doc(user.uid));
    const [openSnack, setOpenSnack] = useState(false);


    useEffect(() => {
        setDisplayName(userData?.data().displayName ?? '');
        setFullName(userData?.data()?.fullName ?? '');
        setLink(userData?.data()?.profileLink ?? '');
        setBio(userData?.data()?.bio ?? '');
        setPhone(userData?.data()?.phoneNumber ?? '');
        // console.log(userData?.data()?.phoneNumber && userData?.data()?.phoneNumber)
    }, [loading, userData])

    const handleCloseSnack = (event) => {
        setOpenSnack(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    const handleChange = event => {
        const fileUploaded = event.target.files[0];

        // Change photoUrl here
        const uploadTask = storage.ref(`images/${fileUploaded.name}`).put(fileUploaded);
        uploadTask.on(
            "state_changed",
            (snapshot => {
                setLoadingAvt(true);
            }),
            (error => {
                console.log(error);
            }),
            () => {
                storage
                    .ref("images")
                    .child(fileUploaded.name)
                    .getDownloadURL()
                    .then(url => {
                        // Update from firestore
                        db.collection("users").doc(user.uid).update({
                            updateAt: firebase.firestore.FieldValue.serverTimestamp(),
                            photoURL: url,
                        })
                        // Update user from firebase auth
                        firebase.auth().currentUser.updateProfile({
                            photoURL: url
                        }).then(function() {
                            // Update successful.
                            setOpenSnack(true);
                            setOpen(false);
                            setLoadingAvt(false);
                        }).catch(function(error) {
                            // An error happened.
                        });

                    })
            }
        )

    };


    const handleRemove = event => {
        db.collection("users").doc(user.uid).update({
            updateAt: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL: "",
        })
        // Update user from firebase auth
        firebase.auth().currentUser.updateProfile({
            photoURL: ""
        }).then(function() {
            // Update successful.
            setLoadingAvt(false);
            setOpenSnack(true);
        }).catch(function(error) {
            // An error happened.
        });
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        db.collection("users").doc(user.uid).update({
            bio: bio,
            profileLink: link,
            fullName: fullName,
            displayName: displayName,
            phoneNumber: phone,
            updateAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

        firebase.auth().currentUser.updateProfile({
            displayName: displayName
        }).then(function() {
            // Update successful.
            setOpenSnack(true);
        })

    }

    return(
        <article className="edit_account__content">
            <>
                <CardHeader
                    className={classes.avatarHolder}
                    avatar={
                        user ? (
                            <Avatar className={classes.avatar} alt={user.displayName} src={user.photoURL}/>
                        ):(
                            <Skeleton animation="wave" variant="circle" width={40} height={40} />
                        )
                    }
                    title={
                        user?.uid ? (
                            <Link to={`/profile/${user.uid}`} className={classes.displayName}>{user.displayName}</Link>
                        ) : (
                            <Skeleton animation="wave" height={10} width="30%" style={{ marginBottom: 6 }} />
                        )
                    }
                    subheader={
                        <Button className={classes.changePhoto} onClick={handleOpen}>Change Profile Photo</Button>
                    }
                />
            </>
            <form method="POST" onSubmit={event => event.preventDefault()}>
                <div className={classes.holder}>
                    <aside className={classes.label}>
                        <label htmlFor="pepName" style={{fontWeight: "bold", fontSize: "18px"}}>Full Name</label>
                    </aside>
                    <div className={classes.input}>
                        <input
                            value={fullName}
                            onChange={event => setFullName(event.target.value)}
                            className={classes.inputField}
                            aria-required="false" id="pepName" placeholder="Name" type="text"
                        />

                        <div className={classes.description}>
                            <span className={classes.descriptionText}>Help people discover your account by using the name you're known by: either your full name, nickname, or business name.</span>
                        </div>
                    </div>
                </div>

                <div className={classes.holder}>
                    <aside className={classes.label}>
                        <label htmlFor="pepUsername" style={{fontWeight: "bold", fontSize: "18px"}}>Display Name</label>
                    </aside>
                    <div className={classes.input}>
                        <input
                            value={displayName}
                            onChange={event => setDisplayName(event.target.value)}
                            className={classes.inputField}
                            aria-required="false" id="pepUsername" placeholder="Username" type="text"
                        />

                        <div className={classes.description}>
                            <span className={classes.descriptionText}>In most cases, you'll be able to change your username back for another 14 days.</span>
                        </div>
                    </div>
                </div>

                <div className={classes.holder}>
                    <aside className={classes.label}>
                        <label htmlFor="pepLink" style={{fontWeight: "bold", fontSize: "18px"}}>Link</label>
                    </aside>
                    <div className={classes.input}>
                        <input
                            value={link}
                            onChange={event => setLink(event.target.value)}
                            className={classes.inputField}
                            aria-required="false" id="pepLink" placeholder="Link" type="text"
                             />

                    </div>
                </div>

                <div className={classes.holder}>
                    <aside className={classes.label}>
                        <label htmlFor="pepBio" style={{fontWeight: "bold", fontSize: "18px"}}>Bio</label>
                    </aside>
                    <div className={classes.input}>
                        <textarea
                            value={bio}
                            onChange={event => setBio(event.target.value)}
                            className={classes.inputText}
                            id="pepBio"
                        />
                        <div className={classes.description}>
                            <span className={classes.descriptionText}>Provide your personal information, even if the account is used for a business, a pet or something else. This won't be a part of your public profile.</span>
                        </div>
                    </div>
                </div>

                <div className={classes.holder}>
                    <aside className={classes.label}>
                        <label htmlFor="pepEmail" style={{fontWeight: "bold", fontSize: "18px"}}>Email</label>
                    </aside>
                    <div className={classes.input}>
                        <input
                            value={user.email}
                            disabled="disabled"
                            className={classes.inputField}
                            aria-required="false" id="pepEmail" placeholder="Email" type="text"
                        />
                    </div>
                </div>


                <div className={classes.holder}>
                    <aside className={classes.label}>
                        <label htmlFor="pepPhone" style={{fontWeight: "bold", fontSize: "18px"}}>Phone Number</label>
                    </aside>
                    <div className={classes.input}>
                        <input
                            value={phone}
                            onChange={event => setPhone(event.target.value)}
                            className={classes.inputField}
                            aria-required="false" id="pepPhone" placeholder="Phone" type="text"
                        />
                    </div>
                </div>

                <div className={classes.submit}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Update</Button>
                </div>

            </form>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className={classes.modalHeader}>
                        <h2>Change profile</h2>
                        <div className={classes.buttonClose}>
                            <IconButton aria-label="Cancel" color="inherit" onClick={handleClose} >
                                <CancelTwoToneIcon />
                            </IconButton>
                        </div>
                    </div>
                    <Divider />
                    <div className={classes.btnAction}>
                        <Button
                            classes={{
                                root: classes.btnUpload,
                                label: classes.btnLabel,
                            }}
                            disabled={loadingAvt}
                            onClick={handleClick}
                        >
                            Upload Photo
                        </Button>
                    </div>
                    <Divider />
                    <div className={classes.btnAction}>
                        <Button
                            classes={{
                                root: classes.btnRemove,
                                label: classes.btnLabel,
                            }}
                            disabled={loadingAvt}
                            onClick={handleRemove}
                        >
                            Remove Photo
                        </Button>
                    </div>
                    {loadingAvt && <CircularProgress size={24} className={classes.buttonProgress} /> }
                    <Divider />

                    <form encType="multipart/form-data" method="POST" role="presentation">
                        <input
                            accept="image/jpeg,image/png"
                            style={{display: "none"}}
                            type="file"
                            ref={hiddenFileInput}
                            onChange={handleChange}
                        />
                    </form>
                </div>

            </Modal>

            <Snackbar
                open={openSnack}
                autoHideDuration={6000}
                onClose={handleCloseSnack}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Alert onClose={handleCloseSnack} severity="success">
                    Upload successfully !
                </Alert>
            </Snackbar>
        </article>

    )
}

export default EditAccount