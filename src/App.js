import { BrowserRouter, useNavigate } from "react-router-dom";
import { AppRouter } from "./components/AppRouter/AppRouter";

import './styles/style.scss'

function App() {

  


  return (
    <div className="App">
    
        <BrowserRouter>

        <AppRouter/>
        
        </BrowserRouter>

    </div>
  );
}

export default App;
