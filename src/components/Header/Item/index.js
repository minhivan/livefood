import React, {useEffect, useState} from "react";

import Avatar from "@material-ui/core/Avatar";
import {Badge, MenuItem, MenuList, Popover} from "@material-ui/core";
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
    LogOut as LogoutIcon, Camera as CameraIcon,
    Bell as BellIcon
} from 'react-feather';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {handleSeenNotification} from "../../../hooks/services";
import {blue} from "@material-ui/core/colors";



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
    userPopoverItem: {
        padding: "10px 20px"
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
    },
    root: {
        width: '420px',
        backgroundColor: theme.palette.background.paper,
        maxHeight: "calc(100vh - 100px)",
        overflowY: "auto",
        minHeight: "200px",
        padding: "8px"
    },
    inline: {
        display: 'inline',
    },
    notFoundIcon: {
        color: "#050505"
    },
    wrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%"
    },
    none: {
        width: "50px",
        height: "50px",
        borderColor: "#262626",
        borderWidth: "2px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        borderRadius: "50%",
        margin: "50px 0 20px 0"
    },
    notiItem: {
        maxHeight: "100px",
        borderRadius: " 8px",
        "&:hover": {
            backgroundColor: "rgba(38, 50, 56, 0.1)",
        },
    },
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
        cursor: "pointer"
    },
}));


function MenuHeader(props) {
    const classes = useStyles();
    const [messCount, setMessCount] = useState(0);
    const {userLogged} = props;

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [anchorElNotice, setAnchorElNotice] = useState(null);
    const openNotice = Boolean(anchorElNotice);
    const idNotice = openNotice ? 'simple-popper' : undefined;
    const [notifications, setNotifications] = useState([])
    // day ago
    dayjs.extend(relativeTime);


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


    useEffect(() => {
        var query = db.collection("conversations");
        userLogged && query
            .where('users', 'array-contains', userLogged.email)
            .where('isSeen', '==', false)
            .where('lastSend', '!=', userLogged.email)
            .onSnapshot((snapshot) => {
                setMessCount(snapshot.size);
            });
    }, [userLogged])

    useEffect(() => {
        const unsubscribe = db.collection('users').doc(userLogged.uid).collection("notifications")
            .orderBy('timestamp', 'desc')
            .limit(30)
            .onSnapshot(snapshot => {
                setNotifications(snapshot.docs.map((doc => ({
                    id: doc.id,
                    data: doc.data(),
                }))))
            })
        return () => {
            unsubscribe();
        }
    }, [userLogged])


    const countNoti = notifications.filter(function(item){
        return item.data.status === "unread";
    }).length; // 6

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
                    state: { users: userLogged }
                }}>
                    <IconButton aria-label="4 new messages" color="inherit" >
                        <Badge badgeContent={messCount} max={20} color="error">
                            <EmailTwoToneIcon className={classes.icon}/>
                        </Badge>
                    </IconButton>
                </Link>

                <IconButton aria-label="11 new notifications" color="inherit" onClick={handleNotice}>
                    <Badge color="error" badgeContent={countNoti} max={20}>
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
                    <List className={classes.root}>
                        {
                            notifications.length > 0  ? (
                                notifications.map(({id, data}) => (
                                    <ListItem alignItems="center" className={classes.notiItem} key={id}>
                                        <ListItemAvatar>
                                            <Link to={`/profile/${data?.uid}`} >
                                                <Avatar alt={data?.displayName} src={data?.avatar} />
                                            </Link>
                                        </ListItemAvatar>
                                        <Link
                                            to={data?.path}
                                            style={{flex: "1 1 auto", paddingRight: "10px"}}
                                            onClick={() => {
                                                handleSeenNotification(userLogged.uid, id);
                                                handleCloseNotice();
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <React.Fragment>
                                                        <span style={{fontWeight: "bold", marginRight: "5px"}}>{data?.from}</span>
                                                        <span>{data?.message}</span>
                                                    </React.Fragment>
                                                }
                                                secondary={
                                                    dayjs(new Date(data?.timestamp?.seconds * 1000).toLocaleString()).fromNow()
                                                }
                                            />
                                        </Link>
                                        {
                                            data?.status === "unread" ? (
                                                <div id="new" className="style-scope ytd-notification-renderer "/>
                                            ) : null
                                        }

                                    </ListItem>
                                ))
                            ) : (
                                <div className={classes.wrapper}>
                                    <div className={classes.none}>
                                        <BellIcon
                                            className={classes.notFoundIcon}
                                            size="20"
                                        />
                                    </div>
                                    <h2 style={{paddingBottom: "10px"}}>You're up to head</h2>
                                </div>
                            )
                        }
                    </List>
                </Popover>

                <IconButton onClick={handleClick}>
                    <Avatar alt={userLogged?.displayName} src={userLogged?.photoURL} className={classes.avatar}/>
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
                    <MenuList autoFocusItem={open} id="menu-list-grow" style={{padding: "0", minWidth: 200}} >
                        <Link to={{pathname:`/profile/${userLogged?.uid}`}} >
                            <MenuItem onClick={handleClose} className={classes.userPopoverItem}>
                                <UserIcon
                                    className={classes.iconBtnCircle}
                                    size="15"
                                />
                                Profile
                            </MenuItem>
                        </Link>
                        <Link to={{pathname:`/profile/saved/${userLogged?.uid}`}} >
                            <MenuItem onClick={handleClose} className={classes.userPopoverItem}>
                                <BookmarkIcon
                                    className={classes.iconBtn}
                                    size="15"
                                />
                                Save
                            </MenuItem>
                        </Link>
                        <Link to={{pathname:`/account/edit`}} >
                            <MenuItem onClick={handleClose} className={classes.userPopoverItem}>
                                <SettingIcon
                                    className={classes.iconBtn}
                                    size="15"
                                />
                                Setting
                            </MenuItem>
                        </Link>
                        <Divider />
                        <MenuItem onClick={() => auth.signOut()} className={classes.userPopoverItem}>
                            <LogoutIcon
                                className={classes.iconBtn}
                                size="15"
                            />
                            Logout
                        </MenuItem>
                    </MenuList>
                </Popover>
            </div>
        </div>
    )
}

export default MenuHeader

