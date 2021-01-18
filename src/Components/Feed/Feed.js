import React, {useEffect, useState} from "react";
import Upload from "../Upload/Upload";
import Post from "../Post/Post";
import RightSideBar from "../AppBar/RightSideBar";
import useFirebaseAuthentication from "../../CustomHook/FirebaseAuth";
import {auth, db} from "../../firebase";

function Feed(){

    const [posts, setPosts] = useState([]);
    const authUser = useFirebaseAuthentication(auth);
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



    return(

        <div className="app__bodyContainer">
            <RightSideBar />
            <div className="app__post">
                {
                    authUser?.displayName ? (
                        <Upload username={authUser.displayName} />
                    ) : null
                }
                {
                    posts.map(({id, post}) => (
                        <Post key={id} caption={post.caption} postId={id} user={authUser} username={post.username} imageUrl={post.imageUrl} timestamp={post.timestamp}/>
                    ))
                }
            </div>

        </div>
    )
}
export default Feed