import React, {useEffect, useState} from "react";
import Page from "../../components/Page";
import ExploreItem from "../../components/Explore/ExploreItem";
import { db} from "../../firebase";
import {Image as ImageIcon} from "react-feather";
import {makeStyles} from "@material-ui/core/styles";
import NavBar from "../../components/SideBar/LeftSideBar";
import Button from "@material-ui/core/Button";

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
    },
    buttonLoadMore: {
        display: "flex",
        width: "100%",
        justifyContent: "center"
    }
}));


const Explore = (props) => {
    const {userLogged} = props;
    const [explore, setExplore] = useState([]);
    const [lastVisible, setLastVisible] = useState('');
    useEffect(() => {
        if(userLogged){
             return db.collection('posts')
                .orderBy('timestamp', "desc")
                .limit(8)
                .get().then(snapshot => {
                    let temp = []
                    snapshot.forEach(data => {
                        let userProfile = {};
                        // if(data.data().uid !== userLogged.uid){
                        //
                        // }
                        data.data().user.get().then( author => {
                            Object.assign(userProfile, author.data());
                        })
                        temp.push({id: data.id, post: data.data(), authorProfile: userProfile })
                    })
                    setExplore(temp);
                    setLastVisible(snapshot.docs[snapshot.docs.length-1]);
                })
        }
        else{
            return db.collection('posts')
                .orderBy('timestamp', "desc")
                .limit(8)
                .get().then(snapshot => {
                    let temp = []
                    snapshot.forEach(data => {
                        let userProfile = {};
                        data.data().user.get().then( author => {
                            Object.assign(userProfile, author.data());
                        })
                        temp.push({id: data.id, post: data.data(), authorProfile: userProfile })
                    })
                    setExplore(temp);
                    setLastVisible(snapshot.docs[snapshot.docs.length-1]);
                })
        }

    }, [userLogged]);


    window.onscroll = function () {
        if(window.scrollY + window.innerHeight >=
            document.documentElement.scrollHeight){
            loadMore()
        }
    }

    const loadMore = () => {
        if(lastVisible){
            db.collection('posts')
                .orderBy('timestamp', "desc")
                .startAfter(lastVisible)
                .limit(8)
                .get().then(snapshot => {
                    let temp = []
                    snapshot.forEach(data => {
                        let userProfile = {};
                        data.data().user.get().then( author => {
                            Object.assign(userProfile, author.data());
                        })
                        temp.push({id: data.id, post: data.data(), authorProfile: userProfile })
                    })
                    setExplore([...explore, ...temp]);
                    setLastVisible(snapshot.docs[snapshot.docs.length-1]);
            })
        }
    }




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
                        explore?.length > 0 ? (
                            <>
                                <div className="explore__masonry" id="list_explore">
                                    {
                                        explore.map(({id, post, authorProfile}) => (
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
                                {/*{*/}
                                {/*    explore.length  ?? (*/}
                                {/*        <div className={classes.buttonLoadMore}>*/}
                                {/*            <Button*/}
                                {/*                onClick={loadMore}*/}
                                {/*                style={{textTransform: "capitalize", fontSize: "16px"}}*/}
                                {/*                color="primary"*/}
                                {/*                variant="contained"*/}
                                {/*            >*/}
                                {/*                Explore more*/}
                                {/*            </Button>*/}
                                {/*        </div>*/}
                                {/*    )*/}
                                {/*}*/}
                            </>

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