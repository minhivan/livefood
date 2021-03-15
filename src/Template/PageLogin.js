import React, {useEffect, useState} from "react";
import {auth} from "../firebase";
import {Button, Modal, TextField} from "@material-ui/core";
import logo from "../images/logo_brand.png";
import {makeStyles} from "@material-ui/core/styles";
import { Redirect } from "react-router-dom"; //import Redirect first


function getModalStyle() {
    const top = 50 ;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    button: {
        padding: "13px",
        fontSize: "18px",
        fontWeight: "bold",
        margin: "16px 0"
    },
    buttonSuccess: {
        padding: "13px",
        fontSize: "18px",
        fontWeight: "bold",
        margin: "16px 0",
        background: "#5cb85c"
    },
    divider: {
        margin: "16px 0",
        borderTop: "1px solid #b6b6b6",
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: 10,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    logo: {
        textAlign: "center",
        paddingTop: 10,
    },
    nut: {
        paddingLeft: 10,
        paddingRight: 10
    },
}));


function PageLogin() {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [modalStyle] = useState(getModalStyle);


    const signIn = (event) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => {
                alert(error.message);
            });
    }

    const signUp = (event) => {
        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return authUser.user.updateProfile({
                    displayName: username
                })
            })
            .catch((error) => alert(error.message));
        setOpen(false);
    }


    useEffect( () => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if(authUser){
                setUser(authUser);
            }else{
                setUser(null);
            }
        })
        return () => {
            unsubscribe();
        }
    }, [user])

    if(user){
        return <Redirect to="/"/>
    }

    return(
        <div className="login__container">
            <div className="login__block">
                <div className="login__background login__article"/>
                <div className="login__holder login__article">
                    <div className="login__authForm">
                        <div className={classes.logo}>
                            <img className="header__imageLogo" alt="LiveFood"
                                 src={logo}
                            />
                        </div>
                        <form className={""} noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                value={email}
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={(e) => setEmail(e.target.value)}

                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                value={password}
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}

                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={signIn}
                            >
                                Sign In
                            </Button>

                            <div className={classes.divider} />
                            <div className="">

                            </div>
                            <div className="signUp">
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    className={classes.buttonSuccess}
                                    onClick={() => setOpen(true)}
                                >
                                    Sign Up
                                </Button>
                                <div className="header__signUp">
                                    <Modal
                                        open={open}
                                        onClose={() => setOpen(false)}
                                        aria-labelledby="simple-modal-title"
                                        aria-describedby="simple-modal-description"
                                    >
                                        <div style={modalStyle} className={classes.paper}>
                                            <div className={classes.logo}>
                                                <img className="header__imageLogo" alt="LiveFood"
                                                     src={logo}
                                                />
                                            </div>
                                            <div className="header__authForm">
                                                <form className={classes.form} noValidate>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        name="username"
                                                        label="Username"
                                                        value={username}
                                                        id="username"
                                                        autoComplete="current-username"
                                                        onChange={(e) => setUsername(e.target.value)}
                                                    />
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="email"
                                                        label="Email Address"
                                                        value={email}
                                                        name="email"
                                                        autoComplete="email"
                                                        autoFocus
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        name="password"
                                                        value={password}
                                                        label="Password"
                                                        type="password"
                                                        id="password"
                                                        autoComplete="current-password"
                                                        onChange={(e) => setPassword(e.target.value)}

                                                    />

                                                    <Button
                                                        type="submit"
                                                        fullWidth
                                                        variant="contained"
                                                        color="default"
                                                        className={classes.buttonSuccess}
                                                        onClick={signUp}
                                                    >
                                                        Sign Up
                                                    </Button>

                                                </form>
                                            </div>
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PageLogin;