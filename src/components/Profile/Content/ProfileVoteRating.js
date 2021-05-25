import React, {useEffect, useState} from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import {Menu as MenuIcon} from "react-feather";
import {makeStyles} from "@material-ui/core/styles";
import {db} from "../../../firebase";
import {Link} from "react-router-dom";
import {Rating} from "@material-ui/lab";
import dayjs from "dayjs";


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
    },
    item: {
        padding : "30px 20px",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "rgba(0,0,0,0.03)",
            transition: "0.2s all ease"
        },
    },
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        padding: "0",
    },
    displayPic: {
        borderRadius: "0",
        height: "120px",
        width: "150px"
    },
    inline: {
        fontWeight: "bold",
        color: "red",
        letterSpacing: "1px"
    },
    container: {
        display: "grid",
        gridTemplateColumns: "repeat(1, 1fr)",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden"
    },
    itemHeader: {
        display: "flex",
        alignItems: "center"
    },
    title: {
        padding: "20px",
        fontSize: "1.3rem",

    }

}));

export default function ProfileVoteRating(props){
    const classes = useStyles();
    const {uid, userLogged, userSnapshot, type} = props;
    const [listVotes, setListVotes] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection("votes")
            .doc(uid)
            .collection("data")
            .orderBy("timestamp", 'desc')
            .onSnapshot(snapshot => {
                setListVotes(
                    snapshot.docs.map((doc => ({
                        id: doc.id,
                        data: doc.data(),
                    })))
                );
        })
        return () => {
            unsubscribe();
        }
    }, [uid])

    console.log(listVotes);

    return (
        <div className="explore__root" style={{paddingTop: "20px" , marginBottom: "50px"}}>
            <div className={classes.container} style={{padding: "0"}} >
                {
                    listVotes ? (
                        <List className={classes.root}>
                            <h3 className={classes.title}>List of recommendations</h3>
                            <Divider />
                            {
                                listVotes.map(({id, data}) => (
                                    <div key={id}>
                                        <ListItem alignItems="flex-start" className={classes.item}>
                                            <ListItemAvatar>
                                                <Avatar alt="Remy Sharp" src={data.avatar} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <div className={classes.itemHeader}>
                                                        <Link to={`/profile/${data?.uid}`} style={{paddingRight: "5px"}}>{data.from}</Link>
                                                        {
                                                            data.timestamp ? (
                                                                <div style={{display: "flex", alignItems: "center"}}>
                                                                    {
                                                                        data.rating ? (
                                                                            <Rating style={{paddingRight: "5px", display: "inline-flex"}} name="read-only" value={data.rating} readOnly size="small"/>
                                                                        ) : null
                                                                    }
                                                                    <span style={{color: "#546e7a", fontSize: "12px", }}>{dayjs(new Date(data.timestamp.seconds * 1000).toLocaleString()).fromNow()}</span>

                                                                </div>
                                                            ) : null
                                                        }
                                                    </div>
                                                }
                                                secondary={
                                                    <React.Fragment>
                                                        {data?.comment}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                    </div>
                                ))
                            }

                        </List>
                    ) : (
                        <List className={classes.root}>
                            <div className={classes.wrapper}>
                                <div className={classes.none}>
                                    <MenuIcon
                                        className={classes.icon}
                                        size="40"
                                    />
                                </div>
                                <h2 style={{paddingBottom: "10px"}}>No Vote Yet</h2>
                            </div>
                        </List>
                    )
                }

            </div>

        </div>
    )
}