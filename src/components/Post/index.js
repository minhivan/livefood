import React, {useEffect, useState} from "react";
import Upload from "../Upload";
import Post from "../Post/Post";
import { db, auth } from "../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";

function NewFeed(){

    const [posts, setPosts] = useState([]);
    const [ authUser ] = useAuthState(auth);

    useEffect(() => {
        db.collection('posts')
            .orderBy('timestamp', "desc")
            .onSnapshot(snapshot => {
                setPosts(snapshot.docs.map(doc => ({
                    id: doc.id,
                    post: doc.data(),
                    author: doc.data().user.get().then( author => {
                        return author.data();
                    })
                })));
            })
    }, []);


    return(
        <div className="app__post">
            {
                authUser?.displayName ? (
                    <Upload username={authUser.displayName} />
                ) : null
            }
            {
                posts.map(({id, post, author}) => (
                    <Post
                        key={id}
                        caption={post.caption}
                        postId={id}
                        author={author}
                        imageUrl={post.imageUrl}
                        timestamp={post.timestamp}
                    />
                ))
            }
        </div>
    )
}
export default NewFeed