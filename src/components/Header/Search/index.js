import React, {useEffect, useState} from "react";
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { Hidden} from "@material-ui/core";
import {createSearchParams, useLocation, useNavigate} from "react-router-dom"

const useStyles = makeStyles((theme) => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade("#f2f2f2", 0.7),
        '&:hover': {
            backgroundColor: fade("#ded9d9", 0.7),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        height: '30px',
        [theme.breakpoints.up('sm')]: {
            width: '20ch',
            '&:focus': {
                width: '30ch',
            },
        },
    },
}));


function HeaderSearch() {
    const classes = useStyles();
    const [query, setQuery] = useState("")
    const navigate = useNavigate();

    const location = useLocation().pathname;

    function handleSubmit(e) {
        e.preventDefault()
        if(query){
            if(location !== "/explore/people"){
                navigate({
                    pathname: "/recipe/search",
                    search: `?${createSearchParams({
                        q: query.toLowerCase()
                    })}`
                });
            }
            else{
                navigate({
                    pathname: location,
                    search: `?${createSearchParams({
                        q: query.toLowerCase()
                    })}`
                });
            }
        }
    }

    // useEffect(() => {
    //     if(!query){
    //         navigate({
    //             pathname: location
    //         });
    //     }
    // }, [query])

    return (
        <Hidden smDown>
            <div className="header__search" onSubmit={handleSubmit}>
                <form action="" method="GET">
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            name="search"
                            value={query}
                            onChange={event => setQuery(event.target.value)}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                </form>

            </div>
        </Hidden>
    )
}

export default HeaderSearch
