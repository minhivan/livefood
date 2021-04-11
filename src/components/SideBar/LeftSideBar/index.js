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
    Bell as BellIcon,
    MapPin as MapIcon
} from 'react-feather';
import NavItem from './NavItem';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../firebase";

// import {useAuthState} from "react-firebase-hooks/auth";
// import {auth} from "../../../firebase";



const useStyles = makeStyles(() => ({
    mobileDrawer: {
        width: 256
    },
    desktopDrawer: {
        width: 256,
        position: "sticky",
        top: "100px",
        height: "calc(100% - 100px)",
        backgroundColor: "#f0f2f5",
        border: "none",
    },
    avatar: {
        cursor: 'pointer',
        width: 56,
        height: 56,
        marginBottom: "10px"
    },
    name: {
        fontWeight: "500",
        fontSize: "1.1rem",
        padding: "0 10px",
        cursor: "pointer",

    },
    util: {
        padding: "0 0 0 20px"
    }
}));

const NavBar = (props) => {
    const classes = useStyles();
    const items = [
        {
            href: '/explore',
            icon: BellIcon,
            title: 'Notifications'
        },
        {
            href: '/explore/people',
            icon: UsersIcon,
            title: 'Followers'
        },
        {
            href: '/profile/saved/' + props.user.uid,
            icon: BookmarkIcon,
            title: 'Saves'
        },
        {
            href: '/watch',
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
            <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                p={2}
            >
                <Avatar
                    className={classes.avatar}
                    component={RouterLink}
                    src={props.user?.photoURL}
                    to={`profile/${props.user?.uid}`}
                />
                <Link to={`profile/${props.user?.uid}`} className={classes.name}>{props.user?.displayName}</Link>
            </Box>
            <Box p={2} className={classes.util}>
                <List>
                    {items.map((item) => (
                        <NavItem
                            href={item.href}
                            key={item.title}
                            title={item.title}
                            icon={item.icon}
                        />
                    ))}
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
