import React from "react";
import NavItem from "../SideBar/LeftSideBar/NavItem";
import {Button, List, ListItem} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {NavLink as RouterLink} from "react-router-dom";
import {Users as UsersIcon} from "react-feather";


const useStyles = makeStyles((theme) => ({
    list: {
        display: "flex",
        flexDirection: "column",
        padding: "0"
    },
    item: {
        display: 'flex',
        paddingTop: 0,
        paddingBottom: 0,
    },
    button: {
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightMedium,
        justifyContent: 'flex-start',
        letterSpacing: 0,
        padding: '15px',
        textTransform: 'none',
        width: '100%',
    },
    icon: {
        marginRight: theme.spacing(1),
        color: "#050505"
    },
    title: {
        fontWeight: "500",
        fontSize: "1.1rem",
        paddingLeft: "15px",
        color: "#050505"
    },
    active: {
        color: theme.palette.primary.main,
        '& $title': {
            fontWeight: 600,
            color: theme.palette.primary.main,
        },
        '& $icon': {
            color: theme.palette.primary.main,
        }
    }
}));


const AccountNavBar = () => {
    const classes = useStyles();

    return (
        <List className={classes.list}>
            <ListItem
                className={classes.item}
                disableGutters
            >
                <Button
                    activeClassName={classes.active}
                    className={classes.button}
                    component={RouterLink}
                    to={`/account/edit`}
                >
                    <span className={classes.title}>Edit profile</span>
                </Button>
            </ListItem>

            <ListItem
                className={classes.item}
                disableGutters
            >
                <Button
                    activeClassName={classes.active}
                    className={classes.button}
                    component={RouterLink}
                    to={`/account/password/change`}
                >
                    <span className={classes.title}>
                    Change Password
                </span>
                </Button>
            </ListItem>

            <ListItem
                className={classes.item}
                disableGutters
            >
                <Button
                    activeClassName={classes.active}
                    className={classes.button}
                    component={RouterLink}
                    to={`/account/setting/notifications`}
                >
                    <span className={classes.title}>
                    Notifications
                </span>
                </Button>
            </ListItem>

        </List>
    )
}

export default AccountNavBar