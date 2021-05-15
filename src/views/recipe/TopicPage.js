import React, {useEffect, useState} from "react";
import Page from "../../components/Page";
import Divider from "@material-ui/core/Divider";
import {db} from "../../firebase";
import {useParams} from "react-router";
import {makeStyles} from "@material-ui/core/styles";
import ListRecipe from "../../components/Recipe/ListRecipe";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";

const useStyles = makeStyles((theme) => ({
    rating: {
        display: "flex",
        alignItems: "center",
        width: "100%"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));


const TopicPage = (props) => {
    const classes = useStyles();
    let { name } = useParams();
    const [topic, setTopic] = useState([]);


    useEffect( () => {
        // if(query) {
        //     return db.collection('posts')
        //         .where('type', '==', 'recipe')
        //         .orderBy('timestamp', "desc")
        //         .limit(12)
        //         .get().then(snapshot => {
        //             var data = [];
        //             snapshot.forEach(doc => {
        //                 var userProfile = {};
        //                 if(doc.data()?.captionToLowerCase?.includes(query)){
        //                     doc.data().user.get().then(author => {
        //                         (Object.assign(userProfile, author.data()));
        //                     })
        //                     data.push({
        //                         id: doc.id,
        //                         post: doc.data(),
        //                         postAuthor: {
        //                             displayName: userProfile.displayName,
        //                             uid: userProfile.uid
        //                         }
        //                     })
        //                 }
        //             })
        //             setTest(data);
        //
        //         }).catch(error => console.log(error));
        // }
        // Set all post
        return db.collection('posts')
            .where('type', '==', 'recipe')
            .where('data.category', '==', name)
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
                setTopic(tracking);
            }).catch(error => console.log(error));
    },[name]);


    return (
        <Page
            title="Topic | LiveFood"
            className="app__bodyContainer"
        >
            {
                topic.length > 0 ? (
                    <div className="recipe__page">
                        <div className="recipe__heading">
                            <h1>{name}</h1>
                        </div>
                        <Divider />
                        <div className="recipe__content">
                            <div className="list-recipe">
                                <div className="list-recipe-grid">
                                    {
                                        topic.map (({id, post, postAuthor}) => (
                                            <ListRecipe key={id} id={id} postAuthor={postAuthor} post={post}/>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Backdrop className={classes.backdrop} open={true} >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                )
            }

        </Page>
    )
}

export default TopicPage;