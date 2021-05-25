import React, {useEffect, useState} from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../../firebase";
import Divider from "@material-ui/core/Divider";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import Previewer from "../../MediaViewer/Preview";
import AddDishes from "../../Upload/AddDishes";

import {handleDeleteMenuItem} from "../../../hooks/services";
import {blue} from "@material-ui/core/colors";
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    avatar: {
        width: 100,
        height: 100,
        margin: "0 20px",
        backgroundColor: blue[100],
        color: blue[600],
    },
    avatarHolder: {
        padding: "16px 32px"
    },
    holder: {
        display: "flex",
        padding: "16px"
    },
    changePhoto: {
        color: "#0095f6",
        padding: 0,
        textTransform: "capitalize"
    },
    displayName: {
        fontSize: 18,
        fontWeight: "bold"
    },
    displayPic: {
        borderRadius: "0",
        height: "60px",
        width: "60px"
    },
    item: {
        cursor: "pointer",
        padding : "15px"
    },
    btnDelete: {
        color : "#fff",
        backgroundColor: "rgb(220, 0, 78)",
        '&:hover': {
            backgroundColor: 'rgb(154, 0, 54)',
        },
        textTransform: "capitalize"
    },
}));

const EditShop = ({userLogged, setOpenSnack}) => {

    const [user] = useAuthState(auth);
    const classes = useStyles();
    const [dataPreview, setDataPreview] = useState('');
    const [open, setOpen] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);

    const [menu, SetMenu] = useState([]);

    const handleOpen = (data) => {
        setDataPreview(data);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setDataPreview('')
    };

    const openAddDishes = () => {
        setOpenAdd(true);
    };

    const handleCloseAddDishes = () => {
        setOpenAdd(false);
    };

    const removeDishes = (uid, id) => {
        handleDeleteMenuItem(uid, id);
        setOpenSnack(true);
    }

    useEffect(() => {

        const unsubscribe = db.collection("users").doc(userLogged.uid)
            .collection("menu")
            .orderBy('timestamp', "desc")
            .onSnapshot((snapshot ) => {
                // var userProfile = {};
                SetMenu(
                    snapshot.docs.map((doc => ({
                        id: doc.id,
                        data: doc.data(),
                    })))
                );
            })

        return () => {
            unsubscribe();
        }
    }, [userLogged])


    return(
        <article className="edit_account__content">
            <div className={classes.profile}>
                <CardHeader
                    className={classes.avatarHolder}
                    avatar={
                        user?.uid ? (
                            <Avatar className={classes.avatar} alt={user.displayName} src={user.photoURL}/>
                        ):(
                            <Skeleton animation="wave" variant="circle" width={40} height={40} />
                        )
                    }
                    title={
                        user?.uid ? (
                            <Link to={`/profile/${user.uid}`} className={classes.displayName}>{user.displayName}</Link>
                        ) : (
                            <Skeleton animation="wave" height={10} width="30%" style={{ marginBottom: 6 }} />
                        )
                    }
                />
                <Divider />
            </div>

            <div className="item-restaurant-row">
                <List className={classes.root}>
                    {
                        menu ? (
                            menu.map(({id, data}) => (
                                <div key={id}>
                                    <ListItem
                                        alignItems="flex-start"
                                        className={classes.item}
                                    >
                                        <ListItemAvatar
                                            style={{margin: "0 10px 0 0"}}
                                            onClick={() => handleOpen(data)}
                                        >
                                            <Avatar className={classes.displayPic} src={data?.mediaUrl} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            onClick={() => handleOpen(data)}
                                            primary={data?.dishName}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        style={{fontWeight: "bold", color: "red"}}
                                                    >
                                                        {new Intl.NumberFormat().format(data?.price)} đ
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                        <Button
                                            className={classes.btnDelete}
                                            variant="contained" color="secondary"
                                            onClick={() => removeDishes(userLogged.uid, id)}
                                        >
                                            Remove
                                        </Button>
                                    </ListItem>
                                    <Divider component="li" />
                                </div>
                            ))
                        ) : null
                    }
                </List>
            </div>

            <div className="addMenu__button">
                <Button variant="contained" color="primary" onClick={openAddDishes} style={{textTransform: "capitalize"}}>Add new</Button>
            </div>


            <Previewer open={open} handleClose={handleClose} data={dataPreview}/>
            <AddDishes open={openAdd} handleClose={handleCloseAddDishes} setOpenSnack={setOpenSnack} userLogged={userLogged}/>

        </article>
    )
}

export default EditShop