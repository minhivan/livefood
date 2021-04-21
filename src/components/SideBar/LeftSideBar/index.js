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
    const [user] = useAuthState(auth);
    let uid = '';
    if(user){
        uid = user.uid;
    }

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
            href: '/profile/saved/' + uid,
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
    const content = (
        <Box
            height="100%"
            display="flex"
            flexDirection="column"
        >
            {
                props.user ? (
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
                            src={props.user?.photoURL}
                            to={`profile/${props.user?.uid}`}
                        />
                        <Link to={`profile/${props.user?.uid}`} className={classes.name}>{props.user?.displayName}</Link>

                    </Box>
                ) : null
            }
            <Box p={2} className={classes.util}>
                <List style={{padding: "0"}}>
                    {items.map((item) => (
                        <NavItem
                            key={item.title}
                            href={item.href}
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
