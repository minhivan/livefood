import './App.css';
import React, {useEffect, useState} from "react";
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
// import {auth, db} from "./firebase";
import GlobalStyles from "./components/GlobalStyle";
import Spinner from 'react-spinkit'


import theme from './theme';
import routes from "./routes";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "./firebase";
import firebase from "firebase";
import Survey from "./components/Popup/Survey";

// import styled from 'styled-components';

// import firebase from "firebase";
// import {useDispatch} from "react-redux";
// import {login, logout} from "./features/userSlice";

function App() {
	const [userLogged, loading] = useAuthState(auth);
	const [survey, setSurvey] = useState(false);
	const routing = useRoutes(routes(userLogged));
	// const u = useSelector(selectUser);
	// const dispatch = useDispatch();

	useEffect(() => {
		if(userLogged) {
			const docRef = db.collection("users").doc(userLogged.uid);
			docRef.get().then((doc) => {
				if(doc.exists){
					if(!doc.data()?.aboutMe){
						setSurvey(true);
					}
					docRef.update({
						lastActive: firebase.firestore.FieldValue.serverTimestamp()
					}).then(() => {
						console.log("Updated");
					})
				}
			})
		}
	}, [userLogged])

	//
	// useEffect(() => {
	// 	if (navigator.geolocation) {
	// 		navigator.geolocation.watchPosition(function(position) {
	// 			console.log("Latitude is :", position.coords.latitude);
	// 			console.log("Longitude is :", position.coords.longitude);
	// 		});
	// 	}
	// })

	if(loading){
		return(
			<AppLoading />
		)
	}
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles />
			{routing}
			{
				survey ? (
					<Survey userLogged={userLogged}/>
				) : null
			}
		</ThemeProvider>
	);
}

export default App;

const AppLoading = () => {
	return (
		<div className="app__loading">
			<img className="loading__logo" alt="LiveFood"
				 src="/static/images/brand.png"
			/>
			<Spinner
				name="circle"
				color="red"
				fadeIn="none"
			/>
		</div>
	)
}


