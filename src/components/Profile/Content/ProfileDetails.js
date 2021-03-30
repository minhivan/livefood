import React from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../firebase";

const ProfileDetails = () => {
    const [user] = useAuthState(auth)
    return(
        <div>
            <h3>123</h3>
        </div>
    )
}

export default ProfileDetails