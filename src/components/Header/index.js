import React, {useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import {auth} from "../../firebase";
import HeaderSearch from "./Search";
import MenuHeader from "./Item";
import AppLogo from "./Logo";


function Header() {

    const [user, setUser] = useState(null);
    useEffect(() => {
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


    return(
        <div className="app__header">
            <div className="header">
                <AppLogo />
                <HeaderSearch />
                <div className="header__auth">
                    {
                        user ? (
                            <MenuHeader auth={auth}/>
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