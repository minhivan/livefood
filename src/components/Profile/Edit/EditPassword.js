import React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";

import {makeStyles} from "@material-ui/core/styles";



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
    const {userLogged} = props;

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