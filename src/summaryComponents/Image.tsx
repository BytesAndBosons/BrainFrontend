import { useContext, useEffect, useState } from "react";
import { NavigationContext } from "../contextProviders/NavigationContextProvider";


export const Image: React.FC<{ src: string, width: string }> = ({ src, width }) => {

    const { navigation, setNavigation } = useContext(NavigationContext);
    const [image, setImage] = useState<Blob | null>(null);


    // Get the summary from the backend
    const loadImage = async () => {

        try {
            const response = await fetch(
                "https://brain.lucschnell.ch/backend/get-image.php",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ summary: navigation, image: src }),
                }
            );

            console.log(`Received the following server response: ${response.status}.`);

            if (response.status == 403) {
                // unauthorized
                setNavigation("login");
            } else if (!response.ok) {
                // something else went wrong
                console.log(`Could not load the image ${src}, response ${response.status} was obtained from the server.`)
            }

            // Success
            const blob = await response.blob();
            setImage(blob);


        } catch (err: any) {
            console.log(`Error loading an image – ${err}.`);
        }
    }

    // Load image whenever the input src changes
    useEffect(() => {
        loadImage();
    }, [src]);

    return (
        <>
            {image && <img src={URL.createObjectURL(image)} width={width} />}
        </>
    )
}