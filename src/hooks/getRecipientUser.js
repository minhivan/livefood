const getRecipientUser = (users, userLogged) =>
    users?.filter(userToFilter => userToFilter !== userLogged?.email)[0];

export default getRecipientUser;