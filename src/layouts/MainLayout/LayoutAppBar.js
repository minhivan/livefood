import React from "react";
import "../../components/Header/Header.css";
import {Link as RouterLink, Navigate} from "react-router-dom";
import {Button} from "@material-ui/core";
import {auth} from "../../firebase";
import HeaderSearch from "../../components/Header/Search";
import MenuHeader from "../../components/Header/Menu";
import {useAuthState} from "react-firebase-hooks/auth";

function LayoutAppBar() {
    const [user] = useAuthState(auth);

    return(
        <div className="app__header">
            <div className="header">
                <div className="header__image">
                    <RouterLink to="/">
                        <img className="header__imageLogo" alt="Live Food"
                             src="/static/images/brand.png"
                        />
                    </RouterLink>
                </div>
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