import React from "react";
import Page from "../../components/Page";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../firebase";
// import {useParams} from "react-router";
import { useCollection } from "react-firebase-hooks/firestore";

import AccountNavBar from "../../components/Profile/AccountNavBar";
import EditAccount from "../../components/Profile/Edit/EditAccount";
import EditPassword from "../../components/Profile/Edit/EditPassword";



const EditAccountPage = (props) => {
    const [currentUser] = useAuthState(auth);
    const [userData] = useCollection(db.collection('users').where('uid', '==', currentUser.uid))
    const user = userData?.docs?.[0].data();
    console.log(props.action)

    function content(action){
        switch (action){
            case "account_edit":
                return <EditAccount />
            case "account_password":
                return <EditPassword />
            default:
                return <></>
        }
    }

    return(
        <Page
            title={`Edit Profile | LiveFood`}
            className="app__bodyContainer"
        >
            <div className="edit_account">
                <section className="edit_account__navigation">
                    <AccountNavBar />
                </section>
                {content(props.action)}
            </div>

        </Page>
    )
}

export default EditAccountPage