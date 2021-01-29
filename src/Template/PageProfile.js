import React from "react";
import {useParams} from "react-router";
import Profile from "../Components/Profile/Profile";

function PageProfile(){
    let { id } = useParams();
    return (
        <div className="app__bodyContainer">
            <Profile id={id}/>
        </div>
    )
}
export default PageProfile