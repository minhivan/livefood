import React, {useEffect, useState} from "react";
import logo from "../../images/brand.png";
import './Header.css';
import {Button} from "@material-ui/core";
import {auth} from "../../firebase";
import HeaderSearch from "./Search";
import MenuHeader from "./Menu";
import {Link} from "react-router-dom";


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
                <div className="header__image">
                    <Link to="/">
                        <img className="header__imageLogo" alt="Live Food"
                             src={logo}
                        />
                    </Link>

                </div>
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