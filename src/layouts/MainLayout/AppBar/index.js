import React from "react";
import {Link as RouterLink} from "react-router-dom";
import {Button} from "@material-ui/core";
import {auth} from "../../../firebase";
import HeaderSearch from "../../../components/Header/Search";
import MenuHeader from "../../../components/Header/Item";
import {useAuthState} from "react-firebase-hooks/auth";
import AppLogo from "../../../components/Header/Logo";

function LayoutAppBar() {
    const [user] = useAuthState(auth);

    return(
        <div className="app__header">
            <div className="header">
                <AppLogo />
                <HeaderSearch />
                <div className="header__auth">
                    {
                        user ? (
                            <MenuHeader user={user}/>
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

export default LayoutAppBar