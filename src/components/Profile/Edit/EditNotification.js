import React, {useEffect, useRef, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db, storage} from "../../../firebase";
import {makeStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import {Link} from "react-router-dom";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import {CircularProgress, IconButton, Modal, Switch} from "@material-ui/core";
// import {green} from "@material-ui/core/colors";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import Divider from "@material-ui/core/Divider";
import {useDocument} from "react-firebase-hooks/firestore";
import firebase from "firebase";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {blue, green} from "@material-ui/core/colors";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';



const useStyles = makeStyles((theme) => ({
    avatar: {
        width: 100,
        height: 100,
        margin: "0 20px",
        backgroundColor: blue[100],
        color: blue[600],
    },
    avatarHolder: {
        padding: "16px 32px",
    },
    holder: {
        display: "flex",
        padding: "16px"
    },
    changePhoto: {
        color: "#0095f6",
        padding: 0,
        textTransform: "capitalize",
    },
    displayName: {
        fontSize: 18,
        fontWeight: "bold"
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
    formControl: {
        margin: 0,
        width: "100%",
        height: "32px"
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


const EditNotification = (props) => {
    const {userLogged, setOpenSnack} = props;
    const classes = useStyles();
    const [state, setState] = React.useState(false);



    const handleChange = (event) => {
        setState((state) => !state);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
    }

    console.log(state);
    return(
        <article className="edit_account__content" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <h3>This section still on develop mode</h3>
            {/*<form method="POST" onSubmit={event => event.preventDefault()}>*/}
            {/*    <div className={classes.holder}>*/}
            {/*        <aside className={classes.label}>*/}
            {/*            <label htmlFor="comments" style={{fontWeight: "bold", fontSize: "18px"}}>Comments</label>*/}
            {/*        </aside>*/}
            {/*        <div className={classes.input}>*/}
            {/*            <Switch*/}
            {/*                checked={state}*/}
            {/*                onChange={handleChange}*/}
            {/*                inputProps={{ 'aria-label': 'secondary checkbox' }}*/}
            {/*                id="comments"*/}
            {/*            />*/}

            {/*            <div className={classes.description}>*/}
            {/*                <span className={classes.descriptionText}>Someone commented: "Nice shot!"</span>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    <div className={classes.holder}>*/}
            {/*        <aside className={classes.label}>*/}
            {/*            <label htmlFor="request" style={{fontWeight: "bold", fontSize: "18px"}}>Follow Requests</label>*/}
            {/*        </aside>*/}
            {/*        <div className={classes.input}>*/}
            {/*            <Switch*/}
            {/*                checked={state}*/}
            {/*                onChange={handleChange}*/}
            {/*                inputProps={{ 'aria-label': 'secondary checkbox' }}*/}
            {/*                id="request"*/}
            {/*            />*/}

            {/*            <div className={classes.description}>*/}
            {/*                <span className={classes.descriptionText}>Someone started to follow you</span>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    <div className={classes.holder}>*/}
            {/*        <aside className={classes.label}>*/}
            {/*            <label htmlFor="email" style={{fontWeight: "bold", fontSize: "18px"}}>Feedback Email</label>*/}
            {/*        </aside>*/}
            {/*        <div className={classes.input}>*/}
            {/*            <Switch*/}
            {/*                checked={state}*/}
            {/*                onChange={handleChange}*/}
            {/*                inputProps={{ 'aria-label': 'secondary checkbox' }}*/}
            {/*                id="email"*/}
            {/*            />*/}

            {/*            <div className={classes.description}>*/}
            {/*                <span className={classes.descriptionText}>Give feedback on our app</span>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    <div className={classes.submit}>*/}
            {/*        <Button variant="contained" color="primary" onClick={handleSubmit}>Update</Button>*/}
            {/*    </div>*/}

            {/*</form>*/}

        </article>

    )
}

export default EditNotification