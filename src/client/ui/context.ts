import React, { useContext } from "react";
import { GameStore } from "../store";

const AppContext = React.createContext<GameStore | null>(null);

export const AppContextProvider = AppContext.Provider;

export const useAppContext = () => {
    const appContext = useContext(AppContext);
    if (appContext === null) {
        throw new Error('App is not wrapped by provider');
    }

    return appContext;
}