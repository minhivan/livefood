import React, {useEffect, useState} from "react";

import Avatar from "@material-ui/core/Avatar";
import {Badge, MenuItem, MenuList, Popover, Popper} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Link} from "react-router-dom";
import ExploreTwoToneIcon from '@material-ui/icons/ExploreTwoTone';
import NotificationsActiveTwoToneIcon from '@material-ui/icons/NotificationsActiveTwoTone';
import { makeStyles} from "@material-ui/core/styles";
import EmailTwoToneIcon from '@material-ui/icons/EmailTwoTone';
// import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../../firebase";
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone';
import Divider from "@material-ui/core/Divider";
import {useAuthState} from "react-firebase-hooks/auth";
import {
    User as UserIcon,
    Bookmark as BookmarkIcon,
    Settings as SettingIcon,
    LogOut as LogoutIcon

} from 'react-feather';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';

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
    },
    userPopover: {
        width: "400px"
    },
    iconBtn: {
        marginRight: theme.spacing(1),
        color: "#050505",
    },
    iconBtnCircle: {
        marginRight: theme.spacing(1),
        color: "#050505",
        border: "1px solid",
        borderRadius: "50%",
    }
}));


function MenuHeader() {
    const [mess, setMess] = useState(0);
    const classes = useStyles();


    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [anchorElNotice, setAnchorElNotice] = useState(null);
    const openNotice = Boolean(anchorElNotice);
    const idNotice = openNotice ? 'simple-popper' : undefined;

    // const [anchorElSasimi, setAnchorElSasimi] = useState(null);
    // const openSasimi = Boolean(anchorElSasimi);
    // const idSasimi = openSasimi ? 'simple-popover' : undefined;


    const [user] = useAuthState(auth);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotice = (event) => {
        setAnchorElNotice(anchorElNotice ? null : event.currentTarget);
    }
    const handleCloseNotice = () => {
        setAnchorElNotice(null);
    };


    // const handleClickSasimi = (event) => {
    //     setAnchorElSasimi(anchorElSasimi ? null : event.currentTarget)
    // }
    // const handleCloseSasimi = () => {
    //     setAnchorElSasimi(null);
    // };



    useEffect(() => {
        var query = db.collection("conversations");
        user && query
            .where('users', 'array-contains', user.email)
            .where('isSeen', '==', false)
            .where('lastSend', '!=', user.email)
            .onSnapshot((snapshot) => {
                setMess(snapshot.size);
            });
    }, [user])


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

                <Link to="/explore/news">
                    <IconButton color="inherit" >
                        <Badge color="secondary" >
                            <ExploreTwoToneIcon className={classes.icon} />
                        </Badge>
                    </IconButton>
                </Link>

                <Link to={{
                    pathname: `/messages`,
                    state: { users: user }
                }}>
                    <IconButton aria-label="4 new messages" color="inherit" >
                        <Badge badgeContent={mess} max={20} color="error">
                            <EmailTwoToneIcon className={classes.icon}/>
                        </Badge>
                    </IconButton>
                </Link>

                <IconButton aria-label="11 new notifications" color="inherit" onClick={handleNotice}>
                    <Badge color="error">
                        <NotificationsActiveTwoToneIcon className={classes.icon}/>
                    </Badge>
                </IconButton>

                <Popover
                    disableScrollLock
                    id={idNotice}
                    open={openNotice}
                    anchorEl={anchorElNotice}
                    onClose={handleCloseNotice}
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
                    className={classes.userPopover}
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
                    <MenuList autoFocusItem={open} id="menu-list-grow" style={{padding: "0", minWidth: 130}} >
                        <Link to={{pathname:`/profile/${user?.uid}`}} >
                            <MenuItem onClick={handleClose}>
                                <UserIcon
                                    className={classes.iconBtnCircle}
                                    size="15"
                                />
                                Profile
                            </MenuItem>
                        </Link>
                        <Link to={{pathname:`/profile/saved/${user?.uid}`}} >
                            <MenuItem onClick={handleClose}>
                                <BookmarkIcon
                                    className={classes.iconBtn}
                                    size="15"
                                />
                                Save
                            </MenuItem>
                        </Link>
                        <Link to={{pathname:`/account/edit`}} >
                            <MenuItem onClick={handleClose}>
                                <SettingIcon
                                    className={classes.iconBtn}
                                    size="15"
                                />
                                Setting
                            </MenuItem>
                        </Link>
                        <Divider />
                        <MenuItem onClick={() => auth.signOut()}>
                            <LogoutIcon
                                className={classes.iconBtn}
                                size="15"
                            />
                            Logout
                        </MenuItem>
                    </MenuList>
                </Popover>
            </div>
            {/*<div className="chat__sasimi">*/}
            {/*    <Fab color="secondary" aria-label="edit" onClick={handleClickSasimi}>*/}
            {/*        <EditIcon />*/}
            {/*    </Fab>*/}
            {/*    <Popover*/}
            {/*        className={classes.userPopover}*/}
            {/*        disableScrollLock*/}
            {/*        id={idSasimi}*/}
            {/*        open={openSasimi}*/}
            {/*        anchorEl={anchorElSasimi}*/}
            {/*        onClose={handleCloseSasimi}*/}
            {/*        anchorOrigin={{*/}
            {/*            vertical: 'center',*/}
            {/*            horizontal: 'left',*/}
            {/*        }}*/}
            {/*        transformOrigin={{*/}
            {/*            vertical: 'center',*/}
            {/*            horizontal: 'left',*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <h3>asdasdasdadasdad</h3>*/}
            {/*    </Popover>*/}
            {/*</div>*/}
        </div>
    )
}

export default MenuHeader

