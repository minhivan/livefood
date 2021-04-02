import React, { useState} from "react";

import Avatar from "@material-ui/core/Avatar";
import {Badge, MenuItem, MenuList, Popover, Popper} from "@material-ui/core";
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
    },
    popupNoti: {
        minHeight: 300,
        zIndex: 99999
    }
}));


function MenuHeader({user}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [anchorElNoti, setAnchorElNoti] = useState(null);
    const openNoti = Boolean(anchorElNoti);
    const idNoti = open ? 'simple-popper' : undefined;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNoti = (event) => {
        setAnchorElNoti(anchorElNoti ? null : event.currentTarget);
    }
    const handleCloseNoti = () => {
        setAnchorElNoti(null);
    };



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
                    pathname: `/messages`,
                    state: { users: user }
                }}>
                    <IconButton aria-label="4 new messages" color="inherit" >
                        <Badge badgeContent={4} max={20} color="secondary">
                            <EmailTwoToneIcon className={classes.icon}/>
                        </Badge>
                    </IconButton>
                </Link>

                <IconButton aria-label="11 new notifications" color="inherit" onClick={handleNoti}>
                    <Badge badgeContent={24} max={20} color="secondary">
                        <NotificationsActiveTwoToneIcon className={classes.icon}/>
                    </Badge>
                </IconButton>

                <Popover
                    disableScrollLock
                    id={idNoti}
                    open={openNoti}
                    anchorEl={anchorElNoti}
                    onClose={handleCloseNoti}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}

                >

                </Popover>


                <IconButton onClick={handleClick}>
                    <Avatar alt={user?.displayName} src={user?.photoURL} />
                </IconButton>
                <Popover
                    disableScrollLock
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
                        <Link to={{pathname:`/profile/${user.uid}`}} ><MenuItem onClick={handleClose}>Profile</MenuItem></Link>
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

