import React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import getRecipientUser from "../../utils/getRecipientUser";
import {auth, db} from "../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useCollection} from "react-firebase-hooks/firestore";

import {Link} from "react-router-dom";
function SidebarChat(props){
    const [user] = useAuthState(auth);
    const recipientUser = getRecipientUser(props.users, user);
    const [recipientUserSnapshot] = useCollection(db.collection('users').where('email' ,'==', recipientUser));
    const recipient = recipientUserSnapshot?.docs?.[0]?.data();


    return(
        <div className="user__inbox  bottomDivider" >
            <Link to={`/messages/t/${props.id}`} style={{width: "100%"}}>
                <CardHeader
                    className="suggest__user"
                    avatar={
                        <Avatar aria-label="recipe" className="" src={recipient?.photoURL}/>
                    }
                    title={recipient?.displayName}
                    subheader="..."
                />
            </Link>
        </div>
    )
}

export default SidebarChat