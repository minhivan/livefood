import './App.css';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	useRouteMatch,
	useParams
} from "react-router-dom";

import {auth, db} from "./firebase";

import PageLogin from "./Template/PageLogin";
import PageMessenger from "./Template/PageMessenger";
import Header from "./Components/Header/Header";
import React from "react";
import Feed from "./Components/Feed/Feed";
import PageProfile from "./Template/PageProfile"
function App() {
	return (
		<div className="app">
			<Router>
				<Route exact path="/login" component={PageLogin}/>
			</Router>
			<Router>
				<Header />
				<div className="app__body">
					<Switch>
						<Route exact path="/" >
							<Feed />
						</Route>
						<Route path="/messenger" component={PageMessenger} />
						<Route path="/profile/:id" component={PageProfile}/>
					</Switch>
				</div>
			</Router>
		</div>

	);
}

export default App;
