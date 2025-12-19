import React, { createContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavigationContextType {
    navigation: string;
    setNavigation: (value: string) => void;
}

export const NavigationContext = createContext<NavigationContextType>({
    navigation: "overview",
    setNavigation: (_: string) => { }
});

const navigationFromPath = (pathname: string): string => {
    const segments = pathname.split("/").filter(Boolean); // remove empty strings 
    const first = segments[0];
    return first ?? "overview"; // return "overview" by default
};

export const NavigationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const location = useLocation();
    const navigate = useNavigate();

    const navigation = useMemo(
        () => navigationFromPath(location.pathname),
        [location.pathname]
    );

    const setNavigation = (value: string) => {
        if (value == "overview") {
            navigate("/", { replace: false });
        } else {
            navigate(`/${value}`, { replace: false });
        }
    };

    const ctxValue = useMemo(
        () => ({ navigation, setNavigation }),
        [navigation]
    )

    return (
        <NavigationContext.Provider value={ctxValue}>
            {children}
        </NavigationContext.Provider>
    );
};
