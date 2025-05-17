import { createContext, useState } from "react";

// define the type of the context
interface NavigationContextType {
    navigation: string;
    setNavigation: (arg1: string) => void;
}

// create context
export const NavigationContext = createContext<NavigationContextType>({
    navigation: "overview",
    setNavigation: (_: string) => {}
})

export const NavigationContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const [navigation, setNavigation] = useState<string>("overview");

    return (
        <NavigationContext.Provider value={{ navigation, setNavigation }}>
            {children}
        </NavigationContext.Provider>
    )
}