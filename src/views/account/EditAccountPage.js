import React, {useState} from "react";
import Page from "../../components/Page";
// import {useAuthState} from "react-firebase-hooks/auth";
// import {auth, db} from "../../firebase";
// import {useParams} from "react-router";
// import { useCollection } from "react-firebase-hooks/firestore";

import AccountNavBar from "../../components/Profile/AccountNavBar";
import EditAccount from "../../components/Profile/Edit/EditAccount";
import EditPassword from "../../components/Profile/Edit/EditPassword";
import EditShop from "../../components/Profile/Edit/EditShop";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Popup from "../../components/Upload/Popup";



function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const EditAccountPage = (props) => {
    // const [currentUser] = useAuthState(auth);
    // const [userData] = useCollection(db.collection('users').where('uid', '==', currentUser.uid))
    // const user = userData?.docs?.[0].data();
    const [openSnack, setOpenSnack] = useState(false);

    const handleCloseSnack = (event) => {
        setOpenSnack(false);
    };

    function content(action){
        switch (action){
            case "edit":
                return <EditAccount userLogged={props.userLogged} />
            case "password":
                return <EditPassword userLogged={props.userLogged}/>
            case "shop":
                return <EditShop userLogged={props.userLogged} setOpenSnack={setOpenSnack} />
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
                    <AccountNavBar userLogged={props.userLogged}/>
                </section>
                {content(props.pagePath)}
            </div>
            <Snackbar
                open={openSnack}
                autoHideDuration={6000}
                onClose={handleCloseSnack}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Alert variant="filled" onClose={handleCloseSnack} severity="success">
                    Upload successfully !
                </Alert>
            </Snackbar>
        </Page>
    )
}

export default EditAccountPage