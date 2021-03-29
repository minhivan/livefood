import React from "react";
import NavItem from "../SideBar/LeftSideBar/NavItem";
import {List} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    list: {
        paddingTop: 0
    }

}));

const items = [
    {
        href: '/account/edit',
        title: 'Edit Profile'
    },
    {
        href: '/account/password/change',
        title: 'Change Password'
    },
    {
        href: '/account/push/setting',
        title: 'Notifications'
    }

];


const AccountNavBar = () => {
    const classes = useStyles();

    return (
        <List className={classes.list}>
            {items.map((item) => (
                <NavItem
                    className={classes.item}
                    href={item.href}
                    key={item.title}
                    title={item.title}
                />
            ))}
        </List>
    )
}

export default AccountNavBar