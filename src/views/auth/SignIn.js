import React, {useEffect, useState} from "react";
import {auth} from "../../firebase";
import {Button, Modal, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Link, Navigate} from "react-router-dom";
import Typography from "@material-ui/core/Typography"; //import Redirect first


const useStyles = makeStyles((theme) => ({
    button: {
        padding: "13px",
        fontSize: "18px",
        fontWeight: "bold",
        margin: "16px 0",
        backgroundColor: "#d26551",
        textTransform: "capitalize",
        '&:hover': {
            backgroundColor: "#d73620",
        },
    },
    divider: {
        margin: "16px 0",
        borderTop: "1px solid #b6b6b6",
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    logo: {
        textAlign: "center",
        paddingBottom: "20px"
    },
    forgot: {
        textAlign: "center",
        display: "block",
        color: "#00376b",
        fontWeight: "bold",
        fontSize: "13px",
        padding: "10px 0"
    },
    SignUpHolder: {
        display: "flex",
        justifyContent: "center",
    },
    SignUp: {
        padding: "0 10px",
        fontWeight: "bold",
        color: "#0095f6"
    }

}));


function PageLogin() {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);


    const signIn = (event) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => {
                alert(error.message);
            });
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
        return <Navigate to="/"/>
    }

    return(
        <div className="login__container">
            <div className="login__block">
                <div className="login__background login__article"/>
                <div className="login__holder login__article">
                    <div className="login__authForm">
                        <div className={classes.logo}>
                            <img className="header__imageLogo" alt="LiveFood"
                                 src="/static/images/brand.png"
                            />
                        </div>
                        <form className="" noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Email address"
                                id="email"
                                placeholder="Email address"
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
                                label="Password"
                                fullWidth
                                name="password"
                                value={password}
                                placeholder="Password"
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
                                Log in
                            </Button>
                        </form>
                        <Link to="" className={classes.forgot}>Forgot your password ?</Link>
                        <div className={classes.divider} />
                        <div className={classes.SignUpHolder}>
                            <span>Don't have an account ?</span>
                            <Link to="/register" className={classes.SignUp}>Sign up</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PageLogin;