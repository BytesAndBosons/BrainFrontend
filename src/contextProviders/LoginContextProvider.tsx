import { createContext, useState } from "react";

// define the type of the context
interface LoginContextType {
    isLoggedIn: boolean;
    setLoggedIn: (arg1: boolean) => void;
    names: (string | null)[];
    setNames: (arg1: (string|null)[]) => void;
}

// create context
export const LoginContext = createContext<LoginContextType>({
    isLoggedIn : false,
    setLoggedIn: (_: boolean) => {},
    names: [null, null],
    setNames: (_: (string | null)[]) => {},
})

export const LoginContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const [names, setNames] = useState<(string | null)[]>([null, null]);

    return (
        <LoginContext.Provider value={{ isLoggedIn, setLoggedIn, names, setNames }}>
            {children}
        </LoginContext.Provider>
    )
}