import React, {useEffect, useState} from "react";
import Page from "../../components/Page";
import ExploreItem from "../../components/Explore/ExploreItem";
import { db} from "../../firebase";
import {Image as ImageIcon} from "react-feather";
import {makeStyles} from "@material-ui/core/styles";
import NavBar from "../../components/SideBar/LeftSideBar";
import MediaViewer from "../../components/MediaViewer";

const useStyles = makeStyles((theme) => ({
    icon: {
        color: "#050505"
    },
    wrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        maxHeight: "300px",
        width: "100%"
    },
    none: {
        width: "100px",
        height: "100px",
        borderColor: "#262626",
        borderWidth: "2px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        borderRadius: "50%",
        margin: "50px 0 20px 0"
    }
}));


const Explore = (props) => {
    const {userLogged} = props;
    const [explore, setExplore] = useState([]);
    window.scroll({top: 0, left: 0, behavior: 'smooth' })

    useEffect(() => {
        let postDoc = db.collection('posts');
        if(userLogged?.uid){
            return postDoc
                .orderBy('timestamp', "desc")
                .limit(10)
                .get().then(snapshot => {
                let temp = []
                snapshot.forEach(data => {
                    var userProfile = {};
                    if(data.data().uid !== userLogged.uid){
                        data.data().user.get().then( author => {
                            Object.assign(userProfile, author.data());
                        })
                        temp.push({id: data.id, post: data.data(), authorProfile: userProfile })
                    }
                })
                setExplore(temp);
            })
        }
        else{
            postDoc
                .orderBy('timestamp', "desc")
                .limit(10)
                .get().then(snapshot => {
                let temp = []
                snapshot.forEach(data => {
                    var userProfile = {};
                    data.data().user.get().then( author => {
                        Object.assign(userProfile, author.data());
                    })
                    temp.push({id: data.id, post: data.data(), authorProfile: userProfile })
                })
                setExplore(temp);
            })
        }
    }, []);


    const classes = useStyles();
    return (
        <Page
            title="Explore | LiveFood"
            className="app__bodyContainer"
        >

            <div className="explore__root">
                <NavBar userLogged={props.userLogged}/>
                <div className="explore__masonry-container">
                    {
                        explore.length > 0 ? (
                            <div className="explore__masonry-content">
                                {
                                    explore.map(({id, post, authorProfile}) => (
                                        <ExploreItem
                                            key={id}
                                            postId={id}
                                            post={post}
                                            postAuthor={authorProfile}
                                            userLogged={userLogged}
                                            classPath={`explore__masonry-item`}
                                        />
                                    ))
                                }
                            </div>
                        ) : (
                            <div className={classes.wrapper}>
                                <div className={classes.none}>
                                    <ImageIcon
                                        className={classes.icon}
                                        size="40"
                                    />
                                </div>
                                <h2 style={{paddingBottom: "10px"}}>Start Upload Your Moments</h2>
                            </div>
                        )
                    }
                </div>
            </div>
        </Page>
    )
}

export default Explore;