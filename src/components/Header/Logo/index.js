import React from "react";
import {Link} from "react-router-dom";
import {Hidden} from "@material-ui/core";

const AppLogo = () => {
    return (
        <div className="header__image">
            <Hidden mdUp>
                <Link to="/">
                    <img className="header__imageLogo" alt="Live Food"
                         src="/static/images/favicon.png"
                    />
                </Link>
            </Hidden>
            <Hidden smDown>
                <Link to="/">
                    <img className="header__imageLogo" alt="Live Food"
                         src="/static/images/brand.png"
                    />
                </Link>
            </Hidden>

        </div>
    )
}

export default AppLogo