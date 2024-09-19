import { createRoot } from "react-dom/client"
import "./styles.css"
import App from "./App"

function Overlay() {
  return (
    <>
      <div className="dot" />
      <App />
    </>
  )
}

createRoot(document.getElementById("root")).render(<Overlay />)
