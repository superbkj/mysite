import React, { createContext, ReactNode } from 'react';

const UserContext = createContext();

function UserProvider(props) {
  const { children } = props;
  const user = '';

  return (
    <UserContext.ThemeProvider value={user}>
      {children}
    </UserContext.ThemeProvider>
  );
}

UserProvider.propTypes = {
  children: ReactNode.isRequired,
};

export { UserContext, UserProvider };
