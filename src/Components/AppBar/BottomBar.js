import React from "react";
import {AppBar, Fab, IconButton, Toolbar} from "@material-ui/core";

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles((theme) => ({
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        paddingBottom: 50,
    },
    list: {
        marginBottom: theme.spacing(2),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    fabButton: {
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
    },
}));



function BottomBar() {
    const classes = useStyles();
    return(
        <AppBar position="fixed" color="primary" className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="open drawer">
                    <MenuIcon />
                </IconButton>
                <Fab color="secondary" aria-label="add" className={classes.fabButton}>
                    <AddIcon />
                </Fab>
                <div className={classes.grow} />
                <IconButton color="inherit">
                    <SearchIcon />
                </IconButton>
                <IconButton edge="end" color="inherit">
                    <MoreIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default BottomBar