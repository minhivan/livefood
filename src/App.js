import './App.css';
import React from "react";
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import {auth, db} from "./firebase";
import GlobalStyles from "./components/GlobalStyle";


// import PageLogin from "./Template/PageLogin";
// import PageMessenger from "./Template/PageMessenger";
// import Header from "./components/Header/Header";
// import PageNotFound from "./Template/PageNotFound";
// import Feed from "./components/Feed/Feed";
// import PageProfile from "./Template/PageProfile"


import theme from './theme';
import routes from "./routes";


function App() {
	const routing = useRoutes(routes);

	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles />
			{routing}
		</ThemeProvider>

		// <div className="app">
		// 	<Router>
		// 		<Switch>
		// 			<Route exact path="/login" component={PageLogin}/>
		// 			<Route>
		// 				<Header />
		// 				<div className="app__body">
		// 					<Switch>
		// 						<Route exact path="/" component={Feed} />
		// 						<Route path="/messenger" component={PageMessenger} />
		// 						<Route path="/messenger/:id" component={PageMessenger} />
		// 						<Route path="/profile/:id" component={PageProfile}/>
		// 						<Route component={PageNotFound}/>
		// 					</Switch>
		// 				</div>
		// 			</Route>
		// 		</Switch>
		//
		// 	</Router>
		// </div>

	);
}

export default App;
