import React, {useEffect, useState} from "react";
import Page from "../../components/Page";
import ExploreItem from "../../components/Explore/ExploreItem";
import {db} from "../../firebase";
import {Image as ImageIcon} from "react-feather";
import {makeStyles} from "@material-ui/core/styles";

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


const Explore = () => {
    const [explore, setExplore] = useState([]);
    useEffect(() => {
        window.scroll({top: 0, left: 0, behavior: 'smooth' });

        let postDoc = db.collection('posts');
        postDoc
            .orderBy('timestamp', "desc")
            .limit(20)
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

    }, []);

    const classes = useStyles();
    return (
        <Page
            title="Explore | LiveFood"
            className="app__bodyContainer"
        >
            <div className="explore__root">
                <div className="explore__container">
                    {
                        explore.length > 0 ? (
                            explore.map(({id, post, authorProfile}) => (
                                <ExploreItem key={id} id={id} post={post} postAuthor={authorProfile} />
                            ))
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