import React, { useState} from "react";

import Avatar from "@material-ui/core/Avatar";
import {Badge, MenuItem, MenuList, Popover} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Link} from "react-router-dom";
import ExploreTwoToneIcon from '@material-ui/icons/ExploreTwoTone';
import NotificationsActiveTwoToneIcon from '@material-ui/icons/NotificationsActiveTwoTone';
import { makeStyles} from "@material-ui/core/styles";
import EmailTwoToneIcon from '@material-ui/icons/EmailTwoTone';
// import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../firebase";
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone';


const useStyles = makeStyles((theme) => ({
    icon: {
        height: "28px",
        width: "28px",
        color: "#00000099"
    },
    active: {
        color: "#3f51b5",
    }
}));


function MenuHeader({user}) {

    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    return(
        <div className="menuHeader">
            <div className="menuIcon">
                <Link to="/">
                    <IconButton color="inherit">
                        <Badge color="secondary">
                            <HomeTwoToneIcon className={classes.icon} />
                        </Badge>
                    </IconButton>
                </Link>

                <Link to="/explore">
                    <IconButton color="inherit" >
                        <Badge color="secondary">
                            <ExploreTwoToneIcon className={classes.icon} />
                        </Badge>
                    </IconButton>
                </Link>

                <Link to={{
                    pathname: `/messenger/${user.uid}`,
                    state: { users: user }
                }}>
                    <IconButton aria-label="4 new messages" color="inherit" >
                        <Badge badgeContent={4} color="secondary">
                            <EmailTwoToneIcon className={classes.icon}/>
                        </Badge>
                    </IconButton>
                </Link>

                <Link to="/">
                    <IconButton aria-label="11 new notifications" color="inherit">
                        <Badge badgeContent={11} color="secondary">
                            <NotificationsActiveTwoToneIcon className={classes.icon}/>
                        </Badge>
                    </IconButton>
                </Link>
                <IconButton onClick={handleClick}>
                    <Avatar alt={user?.displayName} src={user?.photoURL} />
                </IconButton>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}

                >
                    <MenuList autoFocusItem={open} id="menu-list-grow" >
                        <Link to={{pathname:`profile/${user.uid}`}} ><MenuItem onClick={handleClose}>Profile</MenuItem></Link>
                        <Link to={{pathname:`save`}} ><MenuItem onClick={handleClose}>Save</MenuItem></Link>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={() => auth.signOut()}>Logout</MenuItem>

                    </MenuList>
                </Popover>
            </div>

        </div>
    )
}

export default MenuHeader

