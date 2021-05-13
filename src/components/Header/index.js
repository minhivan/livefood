import React from "react";
import {Button} from "@material-ui/core";
import {auth} from "../../firebase";
import HeaderSearch from "./Search";
import MenuHeader from "./Item";
import AppLogo from "./Logo";
import {useAuthState} from "react-firebase-hooks/auth";


function Header() {
    const [ user ] = useAuthState(auth);

    return(
        <div className="app__header no-print">
            <div className="header">
                <AppLogo />
                <HeaderSearch />
                <div className="header__auth">
                    {
                        user ? (
                            <MenuHeader userLogged={user}/>
                        ) : (
                            <div className="header__loginContainer">
                                <Button variant="contained" color="primary" href="/login">
                                    Sign In
                                </Button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Header