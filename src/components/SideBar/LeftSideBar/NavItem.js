import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
    Button,
    ListItem,
    makeStyles
} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    item: {
        display: 'flex',
        paddingTop: 0,
        paddingBottom: 0,
        borderBottom: "1px solid rgb(235, 238, 240)",
        "&:last-child": {
            borderBottom: "none"
        },
    },
    button: props => ({
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightMedium,
        justifyContent: 'flex-start',
        letterSpacing: 0,
        padding: '15px 20px',
        textTransform: 'none',
        width: '100%',
    }),
    icon: {
        marginRight: theme.spacing(1),
        color: "#000",
        fontWeight: "600",
    },
    title: {
        marginRight: 'auto',
        fontWeight: "600",
        fontSize: "1rem",
        paddingLeft: "10px",
        color: "#000"
    },
    active: {
        color: theme.palette.primary.main,
        '& $title': {
            color: "#892074",
            fontWeight: "600",
        },
        '& $icon': {
            color: "#892074",
            fontWeight: "600",
        }
    }
}));

const NavItem = ({
                     className,
                     href,
                     icon: Icon,
                     title,
                     ...rest
                 }) => {
    const classes = useStyles();

    return (
        <ListItem
            className={clsx(classes.item, className)}
            disableGutters
            {...rest}
        >
            <Button
                activeClassName={classes.active}
                className={classes.button}
                component={RouterLink}
                to={href}
            >
                {Icon && (
                    <Icon
                        className={classes.icon}
                        size="20"
                    />
                )}
                <span className={classes.title}>
                    {title}
                </span>
            </Button>
        </ListItem>
    );
};

NavItem.propTypes = {
    className: PropTypes.string,
    href: PropTypes.string,
    icon: PropTypes.elementType,
    title: PropTypes.string
};

export default NavItem;
