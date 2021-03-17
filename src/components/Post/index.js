import React, {useEffect, useState} from "react";
import Upload from "../Upload";
import Post from "../Post/Post";
import { db, auth } from "../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";

function NewFeed(){

    const [posts, setPosts] = useState([]);
    const [ authUser ] = useAuthState(auth);
    //const authUser = auth;

    useEffect(() => {
        db.collection('post')
            .orderBy('timestamp', "desc")
            .onSnapshot(snapshot => {
                setPosts(snapshot.docs.map(doc => ({
                    id: doc.id,
                    post: doc.data(),
                    timestamp: doc.get('timestamp')
                })));
            })

    }, []);

    console.log()

    return(
        <div className="app__post">
            {
                authUser?.displayName ? (
                    <Upload username={authUser.displayName} />
                ) : null
            }
            {
                posts.map(({id, post}) => (
                    <Post key={id} caption={post.caption} postId={id} username={post.username} imageUrl={post.imageUrl} timestamp={post.timestamp}/>
                ))
            }
        </div>
    )
}
export default NewFeed