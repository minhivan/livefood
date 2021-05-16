import React, {useEffect, useState} from "react";
import Page from "../../components/Page";
import Divider from "@material-ui/core/Divider";
import ListRecipe from "../../components/Recipe/ListRecipe";

import {makeStyles} from "@material-ui/core/styles";
import {useLocation} from "react-router-dom";
import {db} from "../../firebase";
import {Image as CameraIcon} from "react-feather";

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
    rating: {
        display: "flex",
        alignItems: "center",
        width: "100%"
    }
}));




export default function ResultRecipePace() {
    const [test, setTest] = useState([]);
    let query = new URLSearchParams(useLocation().search).get("q");
    const classes = useStyles();

    useEffect(() => {
        if(query) {
            return db.collection('posts')
                .where('type', '==', 'recipe')
                .orderBy('timestamp', "desc")
                .limit(12)
                .get().then(snapshot => {
                    let data = [];
                    snapshot.forEach(doc => {
                        let userProfile = {};
                        if(doc.data()?.captionToLowerCase?.includes(query)){
                            doc.data().user.get().then(author => {
                                (Object.assign(userProfile, author.data()));
                            })
                            data.push({
                                id: doc.id,
                                post: doc.data(),
                                postAuthor: {
                                    displayName: userProfile.displayName,
                                    uid: userProfile.uid
                                }
                            })
                        }
                    })
                    setTest(data);

                }).catch(error => console.log(error));
        }
        else{
            return db.collection('posts')
                .where('type', '==', 'recipe')
                .orderBy('timestamp', "desc")
                .limit(12)
                .get().then(async snapshot => {
                    const tracking = await Promise.all(
                        snapshot.docs.map(async doc => ({
                            id: doc.id,
                            post: doc.data(),
                            postAuthor: await Promise.resolve(doc.data().user.get().then( author => {
                                return author.data();
                            }))
                        }))
                    )
                    setTest(tracking);
                }).catch(error => console.log(error));
        }
    }, [query])
    return (
        <Page
            title="Topic | LiveFood"
            className="app__bodyContainer"
        >
            {
                test.length > 0 ? (
                    <div className="recipe__page">
                        <div className="recipe__heading">
                            <h1>TOP RESULT FOR {query}</h1>
                        </div>
                        <Divider />
                        <div className="recipe__content">
                            <div className="list-recipe">
                                <div className="list-recipe-grid">
                                    {
                                        test.map (({id, post, postAuthor}) => (
                                            <ListRecipe key={id} id={id} postAuthor={postAuthor} post={post}/>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={classes.wrapper}>
                        <div className={classes.none}>
                            <CameraIcon
                                className={classes.icon}
                                size="40"
                            />
                        </div>
                        <h2 style={{paddingBottom: "10px"}}>No Recipe Found</h2>
                    </div>
                )
            }

        </Page>
    )
}