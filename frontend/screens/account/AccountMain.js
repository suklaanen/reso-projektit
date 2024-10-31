import React, { useContext } from 'react';
import { AccountLoggedIn, AccountLoggedOut } from './AccountComponents';
import { AuthenticationContext } from '../../services/auth';

const AccountMain = () => {
    const {authState} = useContext(AuthenticationContext);

    return (
        <>
            {authState !== null ? (
                <AccountLoggedIn />
            ) : (
                <AccountLoggedOut/>
            )}
        </>
    );
};

export default AccountMain;