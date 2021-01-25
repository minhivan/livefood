import React from "react";
import {useParams} from "react-router";

function PageProfile(){
    let { id } = useParams();
    return (
        <div className="app__bodyContainer">
            <div className="profile">
                <div className="profile__header">

                </div>

                <div className="profile__body">

                </div>

            </div>
        </div>
    )
}
export default PageProfile