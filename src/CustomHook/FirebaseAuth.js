import React, {useEffect, useState} from "react";
const useFirebaseAuthentication = (auth) => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() =>{
        const unlisten = auth.onAuthStateChanged(
            authUser => {
                authUser
                    ? setAuthUser(authUser)
                    : setAuthUser(null);
            },
        );
        return () => {
            unlisten();
        }
    });
    return authUser
}

export default useFirebaseAuthentication;