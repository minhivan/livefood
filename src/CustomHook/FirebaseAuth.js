import React, {useEffect, useState} from "react";
const useFirebaseAuthentication = (auth) => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() =>{
        const unsubscribe = auth.onAuthStateChanged(
            authUser => {
                authUser
                    ? setAuthUser(authUser)
                    : setAuthUser(null);
            },
        );
        return () => {
            unsubscribe();
        }
    });
    return authUser
}

export default useFirebaseAuthentication;