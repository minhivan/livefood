import React, {useEffect, useState} from "react";
import Page from "../../components/Page";
import {db} from "../../firebase";
import {Video as VideoIcon} from "react-feather";
import {makeStyles} from "@material-ui/core/styles";
import ExploreItem from "../../components/Explore/ExploreItem";
import NavBar from "../../components/SideBar/LeftSideBar";

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



const ExploreVideo = (props) => {
    const classes = useStyles();
    const {userLogged} = props;
    const [exploreVid, setExploreVid] = useState([]);

    useEffect(() => {
        window.scroll({top: 0, left: 0, behavior: 'smooth' });

        let postVideos = db.collection('posts');
        postVideos
            .where('mediaType', '==', 'video/mp4')
            .limit(20)
            .get().then(snapshot => {
                let tempVid = []
                snapshot.forEach(data => {
                    var userProfile = {};
                    data.data().user.get().then( author => {
                        Object.assign(userProfile, author.data());
                    })
                    tempVid.push({id: data.id, post: data.data(), authorProfile: userProfile })
                })
                setExploreVid(tempVid);
            })

    }, []);


    return (
        <Page
            title="Watch | LiveFood"
            className="app__bodyContainer"
        >
            <div className="explore__root">
                <NavBar userLogged={userLogged}/>
                <div className="explore__masonry-container">
                    {
                        exploreVid.length > 0 ? (
                            <div className="explore__masonry" id="list_explore">
                                {
                                    exploreVid.map(({id, post, authorProfile}) => (
                                        <ExploreItem
                                            key={id}
                                            postId={id}
                                            post={post}
                                            postAuthor={authorProfile}
                                            userLogged={userLogged}
                                            masonry={true}
                                        />
                                    ))
                                }
                            </div>
                        ) : (
                            <div className={classes.wrapper}>
                                <div className={classes.none}>
                                    <VideoIcon
                                        className={classes.icon}
                                        size="40"
                                    />
                                </div>
                                <h2 style={{paddingBottom: "10px"}}>Start Record Video</h2>
                                <p>Creating videos to our collection.</p>
                            </div>
                        )
                    }
                </div>
            </div>

        </Page>
    )
}

export default ExploreVideo;