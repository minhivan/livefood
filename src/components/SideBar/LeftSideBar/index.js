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
import {blue} from "@material-ui/core/colors";
import CheckCircleTwoToneIcon from "@material-ui/icons/CheckCircleTwoTone";




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
        width: 56,
        height: 56,
        backgroundColor: blue[100],
        color: blue[600],
        cursor: "pointer"
    },
    name: {
        fontWeight: "600",
        fontSize: "1rem",
        padding: "0 10px",
        cursor: "pointer",
        overflow: "hidden"
    },
    util: {
        padding: "0",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 0 0 1px rgb(0 0 0 / 2%), 0 0 0.5rem 0 rgb(0 0 0 / 1%), 0.25rem 0.5rem 1rem 0 rgb(0 48 111 / 8%)",
        overflow: "hidden"
    },
    userFrame: {
        marginBottom: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 0 0 1px rgb(0 0 0 / 2%), 0 0 0.5rem 0 rgb(0 0 0 / 1%), 0.25rem 0.5rem 1rem 0 rgb(0 48 111 / 8%)",
        overflow: "hidden"
    },
    displayName: {
        display: "flex",
        alignItems: "center",
        fontWeight: "bold",
        paddingBottom: 5,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden"
    }
}));

const NavBar = (props) => {
    const classes = useStyles();
    const [userData] = useDocument(props.userLogged && db.collection("users").doc(props.userLogged.uid));


    const itemsWithAuth = [
        {
            href: '/explore/news',
            icon: BellIcon,
            title: 'Explore'
        },
        {
            href: '/explore/watch',
            icon: VideoIcon,
            title: 'Watch'
        },
        {
            href: '/explore/people',
            icon: UsersIcon,
            title: 'People'
        },
        {
            href: '/profile/saved/' + props.userLogged?.uid,
            icon: BookmarkIcon,
            title: 'Saves'
        },
        {
            href: '/recipe',
            icon: BookOpenIcon,
            title: 'Recipe'
        },
        {
            href: '/recipe/trending',
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
            href: '/explore/news',
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
            href: '/recipe/trending',
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
            className="no-print"
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
                            to={`/profile/${props.userLogged?.uid}`}
                        />

                        <Link to={`/profile/${props.userLogged?.uid}`} className={classes.name}>
                            <span className={classes.displayName}>
                                {props.userLogged?.displayName}
                                {
                                    userData?.data()?.accountVerified ? (
                                        <CheckCircleTwoToneIcon style={{ color: blue[700], marginLeft: "5px"}}/>
                                    ) : null
                                }
                            </span>
                            <span className={classes.displayName} style={{ color: "#546e7a"}}>{userData?.data()?.fullName}</span>
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



export default NavBar;
