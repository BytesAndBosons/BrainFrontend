import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { NavigationContext } from "./contextProviders/NavigationContextProvider";
import { LoginContext } from "./contextProviders/LoginContextProvider";
import { loadIndex, IndexJSON } from "./helperFunctions/loadIndex";


export const ColorButton: React.FC<{ ref: string, children: React.ReactNode }> = ({ ref, children }) => {

    const { setNavigation } = useContext(NavigationContext);
    const { isLoggedIn } = useContext(LoginContext);

    const defaultIndex: IndexJSON = {};
    const [index, setIndex] = useState(defaultIndex);
    const [fullyLoaded, setFullyLoaded] = useState(false);
    const [buttonColor, setButtonColor] = useState<string>("#d63384");
    const [textColor, setTextColor] = useState<string>("#ffffff");

    // Load index.json and set button color
    useEffect(() => {
        loadIndex().then((ind) => {
            setIndex(ind);

            if (ind[ref].passwordProtected && !isLoggedIn) {
                setButtonColor("#272930");
                setTextColor("#b2b2b2");
            }
            setFullyLoaded(true);
        }).catch(err => console.log(err))
    }, [isLoggedIn])


    const toSummary = () => {
        setNavigation(ref);
    }

    if (fullyLoaded) {
        return (
            <Button onClick={toSummary} style={{ backgroundColor: buttonColor, border: buttonColor, color: textColor }}>{(index[ref] && index[ref].passwordProtected && !isLoggedIn) ? "🔒 " : ""}{children}</Button>
        )
    } else {
        return (<></>);
    }
}