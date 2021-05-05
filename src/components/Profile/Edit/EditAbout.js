import React, {useEffect, useState} from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import {Switch, TextField} from "@material-ui/core";
import {useDocument} from "react-firebase-hooks/firestore";
import {db} from "../../../firebase";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} from "react-google-maps";

const useStyles = makeStyles((theme) => ({
    avatar: {
        width: 100,
        height: 100,
        margin: "0 20px",
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
    label: {
        flex: "0 0 25%",
        textAlign: "right",
        paddingTop: "5px"
    },
    input: {
        paddingLeft: 20,
        width: "60%",
        float: "left"
    },
    inputField: {
        width: "100%",
        padding: "0 8px",
        height: "32px",
        fontSize: "16px",
        color: "#262626",
        border: "1px solid rgba(var(--ca6,219,219,219),1)"

    },
    inputText: {
        fontSize: "16px",
        height: 100,
        padding: "6px 10px",
        resize: "vertical",
        border: "1px solid rgba(var(--ca6,219,219,219),1)",
        width: "100%"
    },
    submit: {
        display: "flex",
        justifyContent: "center",
        padding: "20px"
    },
    description: {
        padding: "10px 0"
    },
    descriptionText: {
        textOverflow: "ellipsis",
        textAlign: "justify",
        color: "#8e8e8e",
        fontSize: "12px",
    },
}));


const MapWithAMarker = withScriptjs(withGoogleMap(props =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: props.lat, lng: props.lng }}
    >
        <Marker
            position={{ lat: props.lat, lng: props.lng }}
        />
    </GoogleMap>
));

export default function EditAbout(props){
    const classes = useStyles();
    const {userLogged, setOpenSnack} = props;
    const [bio, setBio] = useState('');
    const [opening, setOpening] = useState('')
    const [closed, setClosed] = useState('')
    const [state, setState] = React.useState(true);
    // const [lat, setLat] = useState('');
    // const [lng, setLng] = useState('');


    const [userData] = useDocument(userLogged &&  db.collection("users").doc(userLogged.uid));

    useEffect(() => {
        setBio(userData?.data()?.aboutRestaurant?.bio ?? '');
        setOpening(userData?.data()?.aboutRestaurant?.opening ?? '07:30')
        setClosed(userData?.data()?.aboutRestaurant?.closed ?? '21:30')
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(function(position) {
                // setLng(position.coords.longitude);
                // setLat( position.coords.latitude)
                // console.log("Latitude is :", position.coords.latitude);
                // console.log("Longitude is :", position.coords.longitude);
            });
        }
    }, [userData]);

    const handleChange = (event) => {
        setState((state) => !state);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        db.collection("users").doc(userLogged.uid).update({
            aboutRestaurant: {
                bio: bio,
                opening: opening,
                closed: closed
            },
        }).then(function() {
            setOpenSnack(true);
            console.log("Setting new data !");
        });
    }

    const handleChangeOpening = (event) => {
        setOpening(event.target.value);
    }

    const handleChangeClosed = (event) => {
        setClosed(event.target.value);
    }


    return (
        <article className="edit_account__content">
            <div className={classes.profile}>
                <CardHeader
                    className={classes.avatarHolder}
                    avatar={
                        userLogged?.uid ? (
                            <Avatar className={classes.avatar} alt={userLogged.displayName} src={userLogged.photoURL}/>
                        ):(
                            <Skeleton animation="wave" variant="circle" width={40} height={40} />
                        )
                    }
                    title={
                        userLogged?.uid ? (
                            <Link to={`/profile/${userLogged.uid}`} className={classes.displayName}>{userLogged.displayName}</Link>
                        ) : (
                            <Skeleton animation="wave" height={10} width="30%" style={{ marginBottom: 6 }} />
                        )
                    }
                />
                <Divider />
                <form method="POST" onSubmit={event => event.preventDefault()}>
                    <div className={classes.holder}>
                        <aside className={classes.label}>
                            <label htmlFor="pepBio" style={{fontWeight: "bold", fontSize: "18px"}}>Bio</label>
                        </aside>
                        <div className={classes.input}>
                            <textarea
                                value={bio}
                                onChange={event => setBio(event.target.value)}
                                className={classes.inputText}
                                id="pepBio"
                            />

                            <div className={classes.description}>
                                <span className={classes.descriptionText}>Provide your personal information, even if the account is used for a business, a pet or something else. This won't be a part of your public profile.</span>
                            </div>
                        </div>
                    </div>

                    <div className={classes.holder}>
                        <aside className={classes.label}>
                            <label htmlFor="pepOpening" style={{fontWeight: "bold", fontSize: "18px"}}>Opening</label>
                        </aside>
                        <div className={classes.input}>
                            <TextField
                                id="pepOpening"
                                type="time"
                                value={opening}
                                onChange={event => handleChangeOpening(event)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 300, // 5 min
                                }}
                            />

                            <div className={classes.description}>
                                <span className={classes.descriptionText}>Provide your opening hour</span>
                            </div>
                        </div>
                    </div>

                    <div className={classes.holder}>
                        <aside className={classes.label}>
                            <label htmlFor="pepClosed" style={{fontWeight: "bold", fontSize: "18px"}}>Closed</label>
                        </aside>
                        <div className={classes.input}>
                            <TextField
                                id="pepClosed"
                                type="time"
                                value={closed}
                                onChange={event => handleChangeClosed(event)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 300, // 5 min
                                }}
                            />

                            <div className={classes.description}>
                                <span className={classes.descriptionText}>Provide your closed hour </span>
                            </div>
                        </div>
                    </div>

                    <div className={classes.holder}>
                        <aside className={classes.label}>
                            <label htmlFor="pepLocation" style={{fontWeight: "bold", fontSize: "18px"}}>Location</label>
                        </aside>
                        <div className={classes.input}>
                            <div className={classes.description}>
                                <Switch
                                    checked={state}
                                    onChange={handleChange}
                                    color="primary"
                                    name="checkedB"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                                <span className={classes.descriptionText}>Coming soon !!!</span>
                            </div>
                        </div>
                    </div>
                    {/*<div className={classes.holder} style={{height: "500px", width: "100%"}}>*/}
                    {/*    <MapWithAMarker*/}
                    {/*        lat={lat}*/}
                    {/*        lng={lng}*/}
                    {/*        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyA96Zjro6Buw-BPKzSf_iO0qfT1Uzh-J1o"*/}
                    {/*        loadingElement={<div style={{ height: `100%`, width: `100%` }} />}*/}
                    {/*        containerElement={<div style={{height: `100%`, width: `100%`  }} />}*/}
                    {/*        mapElement={<div style={{ height: `100%`, width: `100%`  }} />}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className={classes.submit}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>Update</Button>
                    </div>

                </form>
            </div>
        </article>
    )
}