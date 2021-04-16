import React, {useEffect, useState} from "react";
import Upload from "../Upload";
import Post from "./Post";
import { db, auth } from "../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";

export default function NewFeed(){

    const [posts, setPosts] = useState([]);
    const [ authUser ] = useAuthState(auth);
    // const [data, setData] = useState([]);

    //Get post
    useEffect(() => {
        var postRef = db.collection('posts');
        const unsubscribe = postRef
            .orderBy('timestamp', "desc")
            .onSnapshot(snapshot => {
                setPosts(snapshot.docs.map(doc => ({
                    id: doc.id,
                    post: doc.data(),
                })));
            })

        return () => {
            unsubscribe();
        }
    }, []);

    // useEffect(() => {
    //     let post = db.collection('posts');
    //     post
    //         .orderBy('timestamp', "desc")
    //         .limit(20)
    //         .onSnapshot(snapshot => {
    //             let temp = []
    //             snapshot.forEach(data => {
    //                 var userProfile = {};
    //                 data.data().user.get().then( (author) => {
    //                     Object.assign(userProfile, author?.data());
    //                 })
    //                 temp.push({id: data.id, post: data.data(), author: userProfile })
    //             })
    //             setData(temp);
    //          })
    // }, []);
    //
    // console.log(data);

    return(
        <div className="app__post">
            {
                authUser ? (
                    <Upload />
                ) : null
            }
            {
                posts.map(({id, post}) => (
                    <Post
                        key={id}
                        id={id}
                        post={post}
                        author={post.uid}
                    />
                ))
            }
        </div>
    )
}
