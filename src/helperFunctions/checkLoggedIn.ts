export interface LoginResponse {
    first: string;
    last: string;
};
  
export async function checkLoggedIn(setLoggedIn: (_: boolean) => void,setNames: (_: (string | null)[]) => void){
    const response = await fetch(
      "https://brain.lucschnell.ch/backend/login.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: " ", password: " " }),
      }
    );
  
    const data: LoginResponse | { error: string } = await response.json();
  
    if (!response.ok) {
      // Do nothing
    } else {
      // Do success things
      setLoggedIn(true);
      setNames([(data as LoginResponse).first, (data as LoginResponse).last]);
    }
};