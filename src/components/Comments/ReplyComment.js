import React, {useEffect, useState} from "react";
import ReplyCommentDetails from "./ReplyCommentDetails";
import {db} from "../../firebase";

export default function ReplyComment(props) {

    const {userLogged, postId, commentId, seeMore, isPopup} = props
    const [subComments, setSubComments] = useState([]);
    useEffect(() => {
        if(seeMore > 0){
            const unsubscribe = db.collection("posts").doc(postId)
                .collection("comments").doc(commentId).collection("reply")
                .orderBy('timestamp', "desc")
                .limit(seeMore)
                .onSnapshot((snapshot ) => {
                    setSubComments(
                        snapshot.docs.map((doc => ({
                            id: doc.id,
                            comment: doc.data(),
                        })))
                    );
                })

            return () => {
                unsubscribe();
            }
        }

    }, [seeMore,commentId, postId])

    return(
        <>
            {
                subComments ? (
                    subComments.map(({id, comment}) => (
                        <ReplyCommentDetails key={id} replyId={id} userLogged={userLogged} data={comment} commentId={commentId} postId={postId} isPopup={isPopup}/>
                ))
                ) : null
            }
        </>
    )
}