import React from "react";
import NavItem from "../SideBar/LeftSideBar/NavItem";
import {Button, List, ListItem} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {NavLink as RouterLink} from "react-router-dom";
import {List as ListIcon, Users as UsersIcon} from "react-feather";
import {useDocument} from "react-firebase-hooks/firestore";
import {db} from "../../firebase";


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
        borderBottom: "1px solid rgb(235, 238, 240)",

    },
    button: {
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightMedium,
        justifyContent: 'flex-start',
        letterSpacing: 0,
        padding: '10px 15px',
        textTransform: 'none',
        width: '100%',
    },
    icon: {
        marginRight: theme.spacing(1),
        color: "#050505"
    },
    title: {
        fontWeight: "600",
        fontSize: "1rem",
        paddingLeft: "10px",
        color: "#65676B",
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


const AccountNavBar = (props) => {
    const classes = useStyles();
    const { userLogged } = props;

    const [userData] = useDocument(userLogged.uid && db.collection('users').doc(userLogged.uid));
    const userSnapshot = userData?.data()



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
            {
                props.userLogged?.providerData[0]?.providerId === "password" ? (
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
                ) : null
            }

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

            {
                userSnapshot?.accountType === "foodshop" ? (
                    <>
                        <ListItem
                            className={classes.item}
                            disableGutters
                        >
                            <Button
                                activeClassName={classes.active}
                                className={classes.button}
                                component={RouterLink}
                                to={`/account/shop/about`}
                            >
                            <span className={classes.title}>
                                About
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
                                to={`/account/shop/edit`}
                            >
                            <span className={classes.title}>
                                Restaurant Menu
                            </span>
                            </Button>
                        </ListItem>

                    </>
                ) : null
            }

        </List>
    )
}

export default AccountNavBar