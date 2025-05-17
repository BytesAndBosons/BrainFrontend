<img src="./src/assets/logo_b.png" width="100" /><br><br>

# Brain (Frontend)
This repository contains the `React` frontend for my website [brain.lucschnell.ch](https://brain.lucschnell.ch). It displays my personal cheat sheets for different coding languages and frameworks. 


## Structure
The cheat sheets are obtained via HTTP from a backend. They are written in the TSX format and contain custom `React` components defined in `src/summaryComponents` and rendered in `Summary.tsx`. 

## Deployment
In order to run the code locally, use

```bash
npm run dev
```

The deployment to the web server is done automatically via a GitLab CI/CD pipeline. The pipeline builds the website via `npm run build` and uploads the generated files to the server via FTP. 