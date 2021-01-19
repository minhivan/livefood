import React, { useState} from "react";
import avt1 from '../../images/Avatar/avatar1.png';

import Avatar from "@material-ui/core/Avatar";
import {Badge, MenuItem, MenuList, Popover} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DraftsTwoToneIcon from '@material-ui/icons/DraftsTwoTone';
import {Link} from "react-router-dom";
import ExploreTwoToneIcon from '@material-ui/icons/ExploreTwoTone';
import NotificationsActiveTwoToneIcon from '@material-ui/icons/NotificationsActiveTwoTone';
import CloudDoneTwoToneIcon from '@material-ui/icons/CloudDoneTwoTone';
import { makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    icon: {
        height: "28px",
        width: "28px",
        color: "#00000099"
    }
}));


function MenuHeader({auth}) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const [active, setActive] = useState(false);

    const handleClose = () => {
        setAnchorEl(null);
    };
    console.log(auth.currentUser.uid);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleChangeEndpoint = () => {
        setActive(true);
    }



    return(
        <div className="menuHeader">
            <div className="menuIcon">
                <Link to="/">
                    <IconButton aria-label="show 4 new mails" color="inherit" onClick={handleChangeEndpoint}>
                        <Badge color="secondary">
                            <ExploreTwoToneIcon className={classes.icon} />
                        </Badge>
                    </IconButton>
                </Link>

                <Link to="/">
                    <IconButton aria-label="show 11 new notifications" color="inherit">
                        <Badge color="secondary">
                            <CloudDoneTwoToneIcon className={classes.icon}/>
                        </Badge>
                    </IconButton>
                </Link>

                <Link to="/messenger">
                    <IconButton aria-label="show 4 new mails" color="inherit" >
                        <Badge badgeContent={4} color="secondary">
                            <DraftsTwoToneIcon className={classes.icon}/>
                        </Badge>
                    </IconButton>
                </Link>

                <Link to="/">
                    <IconButton aria-label="show 11 new notifications" color="inherit">
                        <Badge badgeContent={11} color="secondary">
                            <NotificationsActiveTwoToneIcon className={classes.icon}/>
                        </Badge>
                    </IconButton>
                </Link>
                <IconButton onClick={handleClick}>
                    <Avatar alt="Remy Sharp" src={avt1} />
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
                        <Link to={{pathname:`profile/${auth.currentUser.uid}`}} ><MenuItem onClick={handleClose}>Profile</MenuItem></Link>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={() => auth.signOut()}>Logout</MenuItem>
                    </MenuList>
                </Popover>
            </div>

        </div>
    )
}

export default MenuHeader

