import React, {useEffect, useState} from "react";
// import {useAuthState} from "react-firebase-hooks/auth";
// import {db} from "../../../firebase";
import {Bookmark as BookmarkIcon} from "react-feather";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    icon: {
        color: "#050505"
    },
    wrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        maxHeight: "300px",
        width: "100%"
    },
    none: {
        width: "100px",
        height: "100px",
        borderColor: "#262626",
        borderWidth: "2px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        borderRadius: "50%",
        margin: "50px 0 20px 0"
    }

}));

const ProfileSaved = ({uid}) => {
    const classes = useStyles();
    const [vid, setVid] = useState([]);
    useEffect(() => {
        window.scroll({top: 0, left: 0, behavior: 'smooth' });

    }, [uid]);

    return(
        <div className="explore__root">
            <div className="explore__container">
                {/*{*/}
                {/*    vid.length > 0 ? (*/}
                {/*        vid.map(({id, post, authorVid}) => (*/}
                {/*            <ExploreItem key={id} post={post} postAuthor={authorVid} />*/}
                {/*        ))*/}
                {/*    ) : (*/}
                {/*        <div className={classes.wrapper}>*/}
                {/*            <div className={classes.none}>*/}
                {/*                <CameraIcon*/}
                {/*                    className={classes.icon}*/}
                {/*                    size="40"*/}
                {/*                />*/}
                {/*            </div>*/}
                {/*            <h3>No Video Yet</h3>*/}
                {/*        </div>*/}
                {/*    )*/}
                {/*}*/}
                <div className={classes.wrapper}>
                    <div className={classes.none}>
                        <BookmarkIcon
                            className={classes.icon}
                            size="40"
                        />
                    </div>
                    <h2 style={{paddingBottom: "10px"}}>Start Saving</h2>
                    <p>Save photos and videos to your collection.</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileSaved