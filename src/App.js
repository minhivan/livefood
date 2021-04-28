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

// import styled from 'styled-components';

import firebase from "firebase";
import {useDispatch} from "react-redux";
import {login, logout} from "./features/userSlice";

function App() {
	const [userLogged, loading] = useAuthState(auth);
	const routing = useRoutes(routes(userLogged));
	// const u = useSelector(selectUser);
	// const dispatch = useDispatch();

	// useEffect(() => {
	// 	if(auth.onAuthStateChanged(author => {
	// 		if(author){
	// 			dispatch(
	// 				login({
	// 					uid: author.uid,
	// 					photoURL: author.photoURL,
	// 					email: author.email,
	// 					displayName: author.displayName
	// 				})
	// 			)
	// 		}else{
	// 			dispatch(logout())
	// 		}
	// 	}))
	//
	// 	if(userLogged) {
	// 		db.collection("users").doc(userLogged.uid).set({
	// 			lastActive: firebase.firestore.FieldValue.serverTimestamp()
	// 		},{
	// 			merge: true
	// 		})
	// 	}
	//
	// }, [dispatch, userLogged])



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


