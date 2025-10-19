import "./App.css";
import MainContent from "./components/MainContent";
import Container from "@mui/material/Container";
import "./i18n";

import { ThemeContextProvider } from "./Context/ThemeContext";

import Header from "./components/Header";

function App() {
  return (
    <>
      <ThemeContextProvider>
        <div
          style={{
            // width: "100vw",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Container
            disableGutters
            maxWidth="lg"
            sx={{
              // border: `1px solid #333`,
              boxShadow:"1px 1px 2px #333 , -1px -1px 2px #333"
            }}
          >
            <Header />
            <MainContent />
          </Container>
        </div>
      </ThemeContextProvider>
    </>
  );
}

export default App;
