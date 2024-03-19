import './App.css';
import {RouterProvider, createHashRouter} from "react-router-dom";

import {HomePage} from "./ui/pages/HomePage";
import {Parties} from "./ui/pages/Parties";
import {Navigation} from "./ui/components/Navigation/Navigation";

const router = createHashRouter([
    {
        path: "/",
        element: <Navigation/>,
        children: [
            {
                path: "/",
                element: <HomePage/>
            },
            {
                path: "/parties",
                element: <Parties/>
            },
        ],
    },
]);


function App() {
  return (
      <div className="App">
          <RouterProvider router={router}/>
      </div>
  );
}

export default App;
