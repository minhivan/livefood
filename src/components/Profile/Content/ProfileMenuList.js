import React, {useEffect, useState} from "react";
import {Menu as MenuIcon} from "react-feather";
import {makeStyles} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import {db} from "../../../firebase";
import Previewer from "../../MediaViewer/Preview";

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
        cursor: "pointer",
        padding : "15px"
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
    }

}));




export default function ProfileMenuList(props){
    const classes = useStyles();
    const [menuList, setMenuList] = useState([]);
    const [dataPreview, setDataPreview] = useState('');
    const [open, setOpen] = useState(false);



    useEffect(() => {
        return db.collection("users").doc(props.uid)
            .collection("menu")
            .orderBy('timestamp', "desc")
            .get().then((snapshot ) => {
                // var userProfile = {};
                setMenuList(
                    snapshot.docs.map((doc => ({
                        id: doc.id,
                        data: doc.data(),
                    })))
                );
            })
    }, [props.uid])


    const handleOpen = (data) => {
        setDataPreview(data);
        setOpen(true);
    };


    const handleClose = () => {
        setDataPreview('');
        setOpen(false)
    };

    //
    return(
        <div className="explore__root" style={{paddingTop: "20px"}}>
            <div className={classes.container} style={{padding: "0"}} >

                <div className="item-restaurant-row">
                    <List className={classes.root}>
                        {
                            menuList ? (
                                menuList.map(({id, data}) => (
                                    <div
                                        key={id}
                                    >
                                        <ListItem

                                            alignItems="flex-start"
                                            className={classes.item}
                                            onClick={() => handleOpen(data)}
                                        >
                                            <ListItemAvatar style={{margin: "0 10px 0 0"}}>
                                                <Avatar className={classes.displayPic} src={data?.mediaUrl} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    data?.dishName
                                                }
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            className={classes.inline}
                                                        >
                                                            {new Intl.NumberFormat().format(data?.price)} đ
                                                        </Typography>
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                    </div>
                                ))
                            ) : (
                                <div className={classes.wrapper}>
                                    <div className={classes.none}>
                                        <MenuIcon
                                            className={classes.icon}
                                            size="40"
                                        />
                                    </div>
                                    <h2 style={{paddingBottom: "10px"}}>No Dish Yet</h2>
                                </div>
                            )
                        }
                    </List>
                </div>

            </div>
            <Previewer open={open} handleClose={handleClose} data={dataPreview}/>

        </div>
    )
}