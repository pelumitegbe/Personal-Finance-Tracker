import React, { createContext, useContext, useState } from "react";
import { Alert, AlertContextType } from "../interface/form";

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

type AlertProviderProps = {
  children: React.ReactNode; // Define the children prop here
};

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (alert: Alert) => {
    setAlerts((prevAlerts) => [...prevAlerts, alert]);
  };

  const hideAlert = () => {
    setAlerts([]);
  };

  return (
    <AlertContext.Provider value={{ alerts, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
