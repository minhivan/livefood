import React, {useEffect, useState} from "react";
import Page from "../components/Page";
// import {makeStyles} from "@material-ui/core/styles";
import RightSideBar from "../components/SideBar/RightSideBar";
import Post from "../components/Posts/Post";
import NavBar from "../components/SideBar/LeftSideBar";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../firebase";
import {useParams} from "react-router";


const SinglePage = (props) => {
    const [user] = useAuthState(auth);
    let { id } = useParams();
    console.log(id);
    const [post, setPost] = useState([]);
    useEffect(() => {
        var postRef = db.collection('posts');
        postRef
            .doc(id)
            .onSnapshot(snapshot => {
                setPost({
                    id: snapshot.id,
                    post: snapshot.data(),
                });
            })
        window.scroll({top: 0, left: 0, behavior: 'smooth' })
    }, [id])

    return (
        <Page
            title="LiveFood"
            className="app__bodyContainer"
        >
            <NavBar auth={user}/>
            <div className="app__post">
                <Post
                    key={id}
                    postId={id}
                    post={post?.post}
                    author={post?.post.uid}
                />
            </div>
            <RightSideBar auth={user}/>
        </Page>
    )
}

export default SinglePage;