import './App.css';
import React, {useEffect, useState} from "react";
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
// import {auth, db} from "./firebase";
import GlobalStyles from "./components/GlobalStyle";
import Spinner from 'react-spinkit'

// import PageLogin from "./Template/PageLogin";
// import PageMessenger from "./Template/PageMessenger";
// import Header from "./components/Header/Header";
// import PageNotFound from "./Template/PageNotFound";
// import Feed from "./components/Feed/Feed";
// import PageProfile from "./Template/PageProfile"


import theme from './theme';
import routes from "./routes";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "./firebase";
import styled from 'styled-components';
import firebase from "firebase";

function App() {
	const routing = useRoutes(routes);
	const [user, loading] = useAuthState(auth);

	// useEffect(() => {
	// 	if(user) {
	// 		db.collection("users").doc(user.uid).set({
	// 			lastActive: firebase.firestore.FieldValue.serverTimestamp()
	// 		},{
	// 			merge: true
	// 		})
	// 	}
	// }, [user])


	if(loading){
		return(
			<AppLoading />
		)
	}
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles />
			{routing}
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
				name="ball-spin-fade-loader"
				color="red"
				fadeIn="none"
			/>
		</div>
	)
}


