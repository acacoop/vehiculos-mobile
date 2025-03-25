import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [headerConfig, setHeaderConfig] = useState({
    title: "Hola @user",
    showBackButton: false,
  });

  return (
    <AppContext.Provider value={{ headerConfig, setHeaderConfig }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
