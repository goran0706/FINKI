const Welcome = () => <h1>Welcome</h1>;

const withLogin = (Component, message) => {
  const isLogged = true; // check if user is logged in
  return isLogged ? <Component message={message} /> : null;
};

export const EnhancedRoute = () => withLogin(Welcome, "Welcome!");
