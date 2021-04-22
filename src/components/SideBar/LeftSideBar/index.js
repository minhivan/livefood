import React  from 'react';
import {Link, Link as RouterLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    Avatar,
    Box,
    Hidden,
    List,
    makeStyles
} from '@material-ui/core';
import {
    Users as UsersIcon,
    Bookmark as BookmarkIcon,
    Video as VideoIcon,
    BookOpen as BookOpenIcon,
    TrendingUp as TrendingUpIcon,
    Compass as BellIcon,
    MapPin as MapIcon
} from 'react-feather';
import NavItem from './NavItem';
import {useDocument} from "react-firebase-hooks/firestore";
import {db} from "../../../firebase";




const useStyles = makeStyles(() => ({
    mobileDrawer: {
        width: 256
    },
    desktopDrawer: {
        width: 290,
        position: "sticky",
        top: "100px",
        height: "calc(100% - 100px)",
        border: "none",
    },
    avatar: {
        cursor: 'pointer',
        width: 56,
        height: 56,
    },
    name: {
        fontWeight: "600",
        fontSize: "1rem",
        padding: "0 10px",
        cursor: "pointer",

    },
    util: {
        padding: "0",
        backgroundColor: "#fff",
        borderRadius: "max(0px, min(8px, calc((100vw - 4px - 100%) * 9999))) / 8px"
    },
    userFrame: {
        marginBottom: "20px",
        backgroundColor: "#fff",
        borderRadius: "max(0px, min(8px, calc((100vw - 4px - 100%) * 9999))) / 8px",
    }
}));

const NavBar = (props) => {
    const classes = useStyles();
    const [userData] = useDocument(props.userLogged && db.collection("users").doc(props.userLogged.uid));

    console.log(userData?.data()?.fullName)

    const itemsWithAuth = [
        {
            href: '/explore',
            icon: BellIcon,
            title: 'Explore'
        },
        {
            href: '/explore/people',
            icon: UsersIcon,
            title: 'Followers'
        },
        {
            href: '/profile/saved/' + props.userLogged?.uid,
            icon: BookmarkIcon,
            title: 'Saves'
        },
        {
            href: '/explore/watch',
            icon: VideoIcon,
            title: 'Watch'
        },
        {
            href: '/recipe',
            icon: BookOpenIcon,
            title: 'Recipe'
        },
        {
            href: '/trending',
            icon: TrendingUpIcon,
            title: 'Trending'
        },
        {
            href: '/location',
            icon: MapIcon,
            title: 'Location'
        },
    ];
    const itemsWithoutAuth = [
        {
            href: '/explore',
            icon: BellIcon,
            title: 'Explore'
        },
        {
            href: '/explore/watch',
            icon: VideoIcon,
            title: 'Watch'
        },
        {
            href: '/recipe',
            icon: BookOpenIcon,
            title: 'Recipe'
        },
        {
            href: '/trending',
            icon: TrendingUpIcon,
            title: 'Trending'
        },
        {
            href: '/location',
            icon: MapIcon,
            title: 'Location'
        },
    ];


    const content = (
        <Box
            height="100%"
            display="flex"
            flexDirection="column"
        >
            {
                props.userLogged ? (
                    <Box
                        alignItems="center"
                        display="flex"
                        flexDirection="row"
                        p={2}
                        className={classes.userFrame}
                    >
                        <Avatar
                            className={classes.avatar}
                            component={RouterLink}
                            src={props.userLogged?.photoURL}
                            to={`profile/${props.userLogged?.uid}`}
                        />

                        <Link to={`profile/${props.userLogged?.uid}`} className={classes.name}>
                            <span style={{display: "block", fontWeight: "bold", paddingBottom: 5}}>{props.userLogged?.displayName}</span>
                            <span style={{display: "block", color: "#546e7a"}}>{userData?.data()?.fullName}</span>
                        </Link>

                    </Box>
                ) : null
            }
            <Box p={2} className={classes.util}>
                <List style={{padding: "0"}}>
                    {
                        props.userLogged ? (
                            itemsWithAuth.map((item) => (
                                <NavItem
                                    key={item.title}
                                    href={item.href}
                                    title={item.title}
                                    icon={item.icon}
                                />
                            ))
                        ) : (
                            itemsWithoutAuth.map((item) => (
                                <NavItem
                                    key={item.title}
                                    href={item.href}
                                    title={item.title}
                                    icon={item.icon}
                                />
                            ))
                        )
                    }
                </List>
            </Box>
        </Box>
    );

    return (
        <Hidden smDown>
            <div className={classes.desktopDrawer}>
                {content}
            </div>
        </Hidden>
    );
};

NavBar.propTypes = {
    onMobileClose: PropTypes.func,
    openMobile: PropTypes.bool
};

NavBar.defaultProps = {
    onMobileClose: () => {},
    openMobile: false
};

export default NavBar;
