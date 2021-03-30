import React, {useRef, useState} from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {IconButton, Modal} from "@material-ui/core";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import Divider from "@material-ui/core/Divider";
import {makeStyles} from "@material-ui/core/styles";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../firebase";


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

const EditPassword = () => {

    const [user] = useAuthState(auth);
    const classes = useStyles();

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
                            <Link to={`profile/${user.uid}`} className={classes.displayName}>{user.displayName}</Link>
                        ) : (
                            <Skeleton animation="wave" height={10} width="30%" style={{ marginBottom: 6 }} />
                        )
                    }
                />
            </div>
            <form method="POST">
                <div className={classes.holder}>
                    <aside className={classes.label}>
                        <label htmlFor="pepOld" style={{fontWeight: "bold", fontSize: "18px"}}>Old Password</label>
                    </aside>
                    <div className={classes.input}>
                        <input
                            className={classes.inputField}
                            aria-required="false" id="pepOld"  type="password"
                        />

                    </div>
                </div>

                <div className={classes.holder}>
                    <aside className={classes.label}>
                        <label htmlFor="pepNewPassword" style={{fontWeight: "bold", fontSize: "18px"}}>New Password</label>
                    </aside>
                    <div className={classes.input}>
                        <input
                            className={classes.inputField}
                            aria-required="false" id="pepNewPassword"  type="password"
                        />
                    </div>
                </div>

                <div className={classes.holder}>
                    <aside className={classes.label}>
                        <label htmlFor="pepConfirm" style={{fontWeight: "bold", fontSize: "18px"}}>Confirm</label>
                    </aside>
                    <div className={classes.input}>
                        <input
                            className={classes.inputField}
                            aria-required="false" id="pepConfirm" type="password"
                        />

                    </div>
                </div>


                <div className={classes.submit}>
                    <Button variant="contained" color="primary">Change</Button>
                </div>

            </form>

        </article>
    )
}

export default EditPassword