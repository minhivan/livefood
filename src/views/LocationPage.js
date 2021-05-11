import React, {useEffect, useState} from "react";
import NavBar from "../components/SideBar/LeftSideBar";
import Page from "../components/Page";
import {db} from "../firebase";
import FormControl from "@material-ui/core/FormControl";
import {InputLabel, MenuItem, Select} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 220,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));


export default function LocationPage(props){
    const {userLogged} = props;
    const [listRestaurantCate, setListRestaurantCate] = useState([]);
    const [restaurantCate, setRestaurantCate] = useState('');
    const [userProvince, setUserProvince] = useState("");
    const [province, setProvince] = useState([]);

    const classes = useStyles();

    useEffect(() => {
        fetch('https://vapi.vnappmob.com/api/province/')
            .then(res => res.json()).then(res => {
            if (res.results && res.results.length > 0) {
                setProvince(res.results)
            }
        });

    }, []);


    useEffect(() => {
        return db.collection('restaurantCategory')
            .orderBy('title', 'asc')
            .get().then( snapshot => {
                setListRestaurantCate(snapshot.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data().title,
                })));
            })
    }, [])


    return (
        <Page
            title="LiveFood"
            className="app__bodyContainer"
        >
            <NavBar userLogged={props.userLogged}/>
            <div className="list-users">
                <div className="list-users__header">
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="restaurant_category_label">Category</InputLabel>
                        <Select
                            labelId="restaurant_category_label"
                            id="restaurant_category"
                            value={restaurantCate}
                            onChange={(event) => setRestaurantCate(event.target.value)}
                            label="Category"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {
                                listRestaurantCate.map(({id, title}) => (
                                    <MenuItem key={id} value={id}>{title}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="restaurant_location_label">Location</InputLabel>
                        <Select
                            native
                            labelId="restaurant_location_label"
                            id="restaurant_location"
                            value={userProvince}
                            onChange={event => setUserProvince(event.target.value)}
                            label="Location"
                        >
                            <option aria-label="None" value="" disabled/>
                            {
                                province?.map((doc) => (
                                    <option key={doc.province_id} value={doc.province_name}>{doc.province_name}</option>
                                ))
                            }
                        </Select>

                    </FormControl>
                </div>
            </div>
        </Page>
    )
}
