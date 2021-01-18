import React from "react";
import {useParams} from "react-router";

function PageProfile(){
    let { id } = useParams();
    return (
        <div className="app__bodyContainer">
            <div className="profile">
                <div>
                    {id}
                </div>
            </div>
        </div>
    )
}
export default PageProfile