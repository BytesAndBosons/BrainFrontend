import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { NavigationContext } from "./contextProviders/NavigationContextProvider";
import { LoginContext } from "./contextProviders/LoginContextProvider";
import { loadIndex, IndexJSON } from "./helperFunctions/loadIndex";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(color: { r: number, g: number, b: number }): string {
    return `#${((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1)}`;
}

function randomlyScaleColor(hexColorIn: string, variation: number): string {

    const rgbColorIn = hexToRgb(hexColorIn);
    let rgbColorOut = rgbColorIn;
    const scalingFactor = Math.random() * variation;

    rgbColorOut.r += Math.round((255 - rgbColorIn.r) * scalingFactor);
    rgbColorOut.g += Math.round((255 - rgbColorIn.g) * scalingFactor);
    rgbColorOut.b += Math.round((255 - rgbColorIn.b) * scalingFactor);

    return rgbToHex(rgbColorOut)
}


export const ColorButton: React.FC<{ ref: string, children: React.ReactNode }> = ({ ref, children }) => {

    const { setNavigation } = useContext(NavigationContext);
    const { isLoggedIn } = useContext(LoginContext);

    const defaultIndex: IndexJSON = {};
    const [index, setIndex] = useState(defaultIndex);
    const [fullyLoaded, setFullyLoaded] = useState(false);
    const [buttonColor, setButtonColor] = useState<string>("#d63384");

    // Load index.json and set button color
    useEffect(() => {
        loadIndex().then((ind) => {
            setIndex(ind);

            let baseColor: string = "#d63384";
            if (ind[ref].passwordProtected && !isLoggedIn) {
                baseColor = "#6c757d";
            }
            setButtonColor(randomlyScaleColor(baseColor, 0)); // color variation to zero
            setFullyLoaded(true);
        }).catch(err => console.log(err))
    }, [isLoggedIn])


    const toSummary = () => {
        setNavigation(ref);
    }

    if (fullyLoaded) {
        return (
            <Button onClick={toSummary} style={{ backgroundColor: buttonColor, border: buttonColor }}>{(index[ref] && index[ref].passwordProtected && !isLoggedIn) ? "🔒 " : ""}{children}</Button>
        )
    } else {
        return (<></>);
    }
}