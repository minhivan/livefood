import React, {useRef, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../firebase";
import {makeStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import {Link} from "react-router-dom";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import {IconButton, Modal, TextField} from "@material-ui/core";
import {green} from "@material-ui/core/colors";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import Divider from "@material-ui/core/Divider";

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
        fontWeight: "bold"
    },
    btnRemove: {
        color : "#d8102a",
        minHeight: "48px",
        width : "100%",
        fontWeight: "bold"
    }
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

        console.log(fileUploaded);
    };



    return(
        <article className="edit_account__content">
            <div className={classes.profile}>
                <CardHeader
                    className={classes.avatarHolder}
                    avatar={
                        user?.uid ? (
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
            </div>
            <form method="POST">
                <div className={classes.holder}>
                    <aside className={classes.label}>
                        <label htmlFor="pepName" style={{fontWeight: "bold", fontSize: "18px"}}>Name</label>
                    </aside>
                    <div className={classes.input}>
                        <input
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
                        <label htmlFor="pepUsername" style={{fontWeight: "bold", fontSize: "18px"}}>Username</label>
                    </aside>
                    <div className={classes.input}>
                        <input
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
                            className={classes.inputField}
                            aria-required="false" id="pepPhone" placeholder="Phone" type="text"
                        />
                    </div>
                </div>

                <div className={classes.submit}>
                    <Button variant="contained" color="primary">Submit</Button>
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
                            className={classes.btnUpload}
                            onClick={handleClick}
                        >
                            Upload Photo
                        </Button>
                    </div>
                    <Divider />
                    <div className={classes.btnAction}>
                        <Button className={classes.btnRemove}>Remove Photo</Button>
                    </div>
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
        </article>
    )
}

export default EditAccount