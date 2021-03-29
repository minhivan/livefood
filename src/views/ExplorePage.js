import React, {useEffect, useState} from "react";
import Page from "../components/Page";
import ExploreItem from "../components/Explore/ExploreItem";
import {db} from "../firebase";

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
                    // postDoc.doc(data.id)
                    //     .collection("comments")
                    //     .orderBy('timestamp')
                    //     .limit(20).get().then(querySnap => {
                    //         // querySnap.docs.map((doc) => {
                    //         //     comments.data = doc.data();
                    //         // })
                    //         querySnap.forEach((doc) => {
                    //             // doc.data() is never undefined for query doc snapshots
                    //             Object.assign(comments, doc.data());
                    //         });
                    // })

                    data.data().user.get().then( author => {
                        Object.assign(userProfile, author.data());
                    })
                    temp.push({id: data.id, post: data.data(), authorProfile: userProfile })
                })
                setExplore(temp);
        })

    }, []);

    // const classes = useStyles();
    return (
        <Page
            title="Explore | LiveFood"
            className="app__bodyContainer"
        >
            <div className="explore__root">
                <div className="explore__container">
                    {explore.map(({id, post, authorProfile}) => (
                        <ExploreItem key={id} post={post} postAuthor={authorProfile} />
                        // <Post key={id} post={post} author={userProfile} />
                    ))}
                </div>
            </div>

        </Page>
    )
}

export default Explore;