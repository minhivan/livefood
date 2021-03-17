import React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";


function SidebarChat(){
    return(
        <div className="user__inbox  bottomDivider">
            <CardHeader className="suggest__user"
                        avatar={
                            <Avatar aria-label="recipe" className="">
                                K
                            </Avatar>
                        }
                        title="minhivan"
                        subheader="Are you sure"
            />
        </div>
    )
}

export default SidebarChat