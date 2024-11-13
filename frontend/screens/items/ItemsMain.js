import React, { useContext } from 'react';
import { ItemsLoggedIn, ItemsLoggedOut } from './ItemComponents';
import { AuthenticationContext } from '../../services/auth';

const ItemsMain = () => {
    const {authState} = useContext(AuthenticationContext);

    return (
    <>
        {authState ? (
            <ItemsLoggedIn />
        ) : (
            <ItemsLoggedOut />
        )}
    </>
    );
};

export default ItemsMain;