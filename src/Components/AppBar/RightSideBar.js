import React from "react";
import './RightSideBar.css';


import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import IconButton from "@material-ui/core/IconButton";
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import Avatar from "@material-ui/core/Avatar";
// import dayjs from "dayjs";
import CardHeader from "@material-ui/core/CardHeader";
import {Button} from "@material-ui/core";


function RightSideBar() {
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