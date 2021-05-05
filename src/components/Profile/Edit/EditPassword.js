import React, {useEffect, useState} from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";

import {makeStyles} from "@material-ui/core/styles";
import {auth} from "../../../firebase";
import firebase from "firebase";



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
    submit: {
        display: "flex",
        justifyContent: "center",
        padding: "20px"
    },
}));

const EditPassword = (props) => {
    const {userLogged, setOpenSnack} = props;
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [rePass, setRePass] = useState('');
    const [disable, setDisable] = useState(true);

    useEffect(() => {
        if(oldPass.length >= 8 && newPass.length >= 8 && rePass.length >= 8){
            if(rePass === newPass){
                setDisable(false);
            }
        }else {
            setDisable(true)
        }
    }, [newPass.length, oldPass.length, rePass.length])

    // auth.sendPasswordResetEmail("minhmuofficial@gmail.com").then(function() {
    //     // Email sent.
    //     console.log("true")
    // }).catch(function(error) {
    //     // An error happened.
    //     console.log(error)
    // });

    const handleChangePassword = () => {
        var user = firebase.auth().currentUser;

        user.updatePassword(newPass).then(function() {
            // Update successful.
            setOpenSnack(true)
            setRePass('');
            setNewPass('');
            setOldPass('');
        }).catch(function(error) {
            // An error happened.
            console.log(error)
        });
    }
    const classes = useStyles();

    return(
        <article className="edit_account__content">
            <div className={classes.profile}>
                <CardHeader
                    className={classes.avatarHolder}
                    avatar={
                        userLogged?.uid ? (
                            <Avatar className={classes.avatar} alt={userLogged.displayName} src={userLogged.photoURL}/>
                        ):(
                            <Skeleton animation="wave" variant="circle" width={40} height={40} />
                        )
                    }
                    title={
                        userLogged?.uid ? (
                            <Link to={`profile/${userLogged.uid}`} className={classes.displayName}>{userLogged.displayName}</Link>
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
                            value={oldPass}
                            onChange={event => setOldPass(event.target.value)}
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
                            value={newPass}
                            onChange={event => setNewPass(event.target.value)}
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
                            value={rePass}
                            onChange={event => setRePass(event.target.value)}
                            aria-required="false" id="pepConfirm" type="password"
                        />

                    </div>
                </div>

                <div className={classes.submit}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={disable}
                        onClick={handleChangePassword}
                    >
                        Change
                    </Button>
                </div>

            </form>

        </article>
    )
}

export default EditPassword