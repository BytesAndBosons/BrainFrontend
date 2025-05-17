// Interface for index JSON file
export interface IndexJSON {
    [key: string]: {
        file: string;
        passwordProtected: boolean;
        section: string;
        title: string;
      }; 
}

// Function to load index from backend
export async function loadIndex():Promise<IndexJSON> {
    
    const response = await fetch(
      "https://brain.lucschnell.ch/backend/get-index.php",
      {
        method: "GET",
      }
    );

    const data: IndexJSON | { error: string } = await response.json();

    console.log(`Received the following server response: ${response.status}.`);

    if (!response.ok) {
      // something went wrong
      throw new Error(`Received status ${response.status} when trying to load the index.json file.`);
    }

    // Success
    return (data as IndexJSON);
}
