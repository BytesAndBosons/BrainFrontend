import { useContext, useEffect, useMemo, useState } from "react";
import { NavigationContext } from "../contextProviders/NavigationContextProvider";


export const Image: React.FC<{ src: string, width: string, caption: string | null }> = ({ src, width, caption }) => {

    const { navigation, setNavigation } = useContext(NavigationContext);
    const [image, setImage] = useState<Blob | null>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxVisible, setLightboxVisible] = useState(false);

    const imageUrl = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);

    useEffect(() => {
        return () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };
    }, [imageUrl]);


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

    // Trigger the enlarge animation once the overlay has mounted
    useEffect(() => {
        if (lightboxOpen) {
            const frame = requestAnimationFrame(() => setLightboxVisible(true));
            return () => cancelAnimationFrame(frame);
        }
    }, [lightboxOpen]);

    const closeLightbox = () => {
        setLightboxVisible(false);
    };

    return (
        <>
            {image &&

                <figure className="figure mb-5 mt-3">
                    <img
                        src={imageUrl ?? undefined}
                        width={width}
                        className="paper-image img-thumbnail"
                        onClick={() => setLightboxOpen(true)}
                    />
                    {caption && <figcaption className="figure-caption mt-3"><b>Figure: </b>{caption}</figcaption>}
                </figure>}

            {lightboxOpen && (
                <div
                    className={`image-lightbox-overlay${lightboxVisible ? " open" : ""}`}
                    onClick={closeLightbox}
                    onTransitionEnd={(e) => {
                        if (e.target === e.currentTarget && !lightboxVisible) {
                            setLightboxOpen(false);
                        }
                    }}
                >
                    <img
                        src={imageUrl ?? undefined}
                        className="image-lightbox-img"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    )
}