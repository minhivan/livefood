import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {Button, List, ListItem} from "@material-ui/core";
import {NavLink as RouterLink} from "react-router-dom";
import {
    Grid as GridIcon,
    Bookmark as BookmarkIcon,
    Film as FilmIcon
} from 'react-feather';



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


const ProfileNavBar = ({user}) => {
    const classes = useStyles();


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
                    to={`/profile/${user?.uid}/`}
                >
                    <GridIcon
                        className={classes.icon}
                        size="20"
                    />
                    <span className={classes.title}>
                    Post
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
                    to={`/profile/${user?.uid}/channel`}
                >
                    <FilmIcon
                        className={classes.icon}
                        size="20"
                    />
                    <span className={classes.title}>
                    Video
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
                    to={`/profile/${user?.uid}/saved`}
                >
                    <BookmarkIcon
                        className={classes.icon}
                        size="20"
                    />
                    <span className={classes.title}>
                    Save
                </span>
                </Button>
            </ListItem>
        </List>

    )
}

export default ProfileNavBar