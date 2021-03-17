import React from "react";
import './RightSideBar.css';


import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import IconButton from "@material-ui/core/IconButton";
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import Avatar from "@material-ui/core/Avatar";
// import dayjs from "dayjs";
import CardHeader from "@material-ui/core/CardHeader";
import {Button, Collapse, makeStyles} from "@material-ui/core";
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import InboxIcon from '@material-ui/icons/MoveToInbox';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));


function RightSideBar() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    return(
        <div className="app__rightSideBar">
            <div className="sideBar__container">
                <div className="trending__container sideBar__containerBlock">
                    <div className="trending__header bottomDivider padding-10-20">
                        <h2>What's fresh?</h2>
                        <IconButton aria-label="comment" >
                            <SettingsOutlinedIcon />
                        </IconButton>
                    </div>
                    <div className="trending__content padding-10-20 bottomDivider">
                        <div className="trending__contentBlock">
                            <div className="trending__header">
                                <h4>Trending in VietNam</h4>
                                <IconButton aria-label="comment" >
                                    <MoreHorizOutlinedIcon />
                                </IconButton>
                            </div>
                            <div className="trending__name">
                                <h3>Healthy</h3>
                            </div>
                        </div>
                    </div>
                    <div className="trending__content padding-10-20 bottomDivider">
                        <div className="trending__contentBlock">
                            <div className="trending__header">
                                <h4>Trending in VietNam</h4>
                                <IconButton aria-label="comment" >
                                    <MoreHorizOutlinedIcon />
                                </IconButton>
                            </div>
                            <div className="trending__name">
                                <h3>Healthy</h3>
                            </div>
                        </div>
                    </div>
                    <div className="trending__content padding-10-20 bottomDivider">
                        <div className="trending__contentBlock">
                            <div className="trending__header">
                                <h4>Trending in VietNam</h4>
                                <IconButton aria-label="comment" >
                                    <MoreHorizOutlinedIcon />
                                </IconButton>
                            </div>
                            <div className="trending__name">
                                <h3>Healthy</h3>
                            </div>
                        </div>
                    </div>
                    <div role="button" className="padding-20 show-more">
                        <span className="">Show more</span>
                    </div>
                </div>

                <div className="suggest__container sideBar__containerBlock">
                    <div className="suggest__header padding-20 bottomDivider">
                        <h2>Who to follow</h2>
                    </div>
                    <div className="suggest__content  bottomDivider">
                        <CardHeader className="suggest__user"
                                    avatar={
                                        <Avatar aria-label="recipe" className="">
                                            K
                                        </Avatar>
                                    }
                                    title="minhivan"
                                    subheader="@asdasd"
                        />

                        <Button variant="outlined" color="primary" className="followBtn">
                            Follow
                        </Button>
                    </div>
                    <div className="suggest__content  bottomDivider">
                        <CardHeader className="suggest__user"
                                    avatar={
                                        <Avatar aria-label="recipe" className="">
                                            K
                                        </Avatar>
                                    }
                                    title="minhivan"
                                    subheader="@asdasd"
                        />

                        <Button variant="outlined" color="primary" className="followBtn">
                            Follow
                        </Button>
                    </div>
                    <div className="suggest__content  bottomDivider">
                        <CardHeader className="suggest__user"
                                    avatar={
                                        <Avatar aria-label="recipe" className="">
                                            K
                                        </Avatar>
                                    }
                                    title="minhivan"
                                    subheader="@asdasd"
                        />

                        <Button variant="outlined" color="primary" className="followBtn">
                            Follow
                        </Button>
                    </div>
                    <div className="suggest__content  bottomDivider">
                        <CardHeader className="suggest__user"
                                    avatar={
                                        <Avatar aria-label="recipe" className="">
                                            K
                                        </Avatar>
                                    }
                                    title="minhivan"
                                    subheader="@asdasd"
                        />

                        <Button variant="outlined" color="primary" className="followBtn">
                            Follow
                        </Button>
                    </div>
                    <div role="button" className="padding-20 show-more">
                        <span className="">Show more</span>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default RightSideBar;