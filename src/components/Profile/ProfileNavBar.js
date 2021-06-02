import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, List, ListItem} from "@material-ui/core";
import {NavLink as RouterLink} from "react-router-dom";
import {
    Grid as GridIcon,
    Bookmark as BookmarkIcon,
    Video as VideoIcon,
    List as ListIcon
} from 'react-feather';
import {useAuthState} from "react-firebase-hooks/auth";

import {auth} from "../../firebase";




const useStyles = makeStyles((theme) => ({
    list: {
        display: "flex"
    },
    item: {
        display: 'flex',
        paddingTop: 0,
        paddingBottom: 0,
    },
    button: {
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightMedium,
        justifyContent: 'center',
        letterSpacing: 0,
        padding: '10px 8px',
        textTransform: 'none',
        width: '100%'
    },
    icon: {
        marginRight: theme.spacing(1),
        color: "#050505"
    },
    title: {
        fontWeight: "bold",
        fontSize: "1rem",
        paddingLeft: "15px",
        color: "#65676B"
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


const ProfileNavBar = ({userSnapshot}) => {
    const classes = useStyles();
    const [authUser] = useAuthState(auth);



    return(
        <List className={classes.list}>
            <ListItem
                className={classes.item}
                disableGutters
            >
                <Button
                    activeClassName={classes.active}
                    className={classes.button}
                    component={RouterLink}
                    to={`/profile/${userSnapshot?.uid}`}
                >
                    <GridIcon
                        className={classes.icon}
                        size="20"
                    />
                    <span className={classes.title}>Post</span>
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
                                to={`/profile/dishes/${userSnapshot?.uid}`}
                            >
                                <ListIcon
                                    className={classes.icon}
                                    size="20"
                                />
                                <span className={classes.title}>Dishes</span>
                            </Button>
                        </ListItem>
                    </>
                ) : null
            }
            {
                userSnapshot?.accountType === "reviewer" ? (
                    <ListItem
                        className={classes.item}
                        disableGutters
                    >
                        <Button
                            activeClassName={classes.active}
                            className={classes.button}
                            component={RouterLink}
                            to={`/profile/channel/${userSnapshot?.uid}`}
                        >
                            <VideoIcon
                                className={classes.icon}
                                size="20"
                            />
                            <span className={classes.title}>Video</span>
                        </Button>
                    </ListItem>
                ) : null
            }

            {
                userSnapshot?.uid === authUser?.uid ? (
                    <ListItem
                        className={classes.item}
                        disableGutters
                    >
                        <Button
                            activeClassName={classes.active}
                            className={classes.button}
                            component={RouterLink}
                            to={`/profile/saved/${userSnapshot?.uid}`}
                        >
                            <BookmarkIcon
                                className={classes.icon}
                                size="20"
                            />
                            <span className={classes.title}>Save</span>
                        </Button>
                    </ListItem>
                ) : null
            }

        </List>

    )
}

export default ProfileNavBar