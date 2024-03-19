import './App.css';
import {RouterProvider, createHashRouter} from "react-router-dom";

import Root from "./ui/pages/Root";
import {HomePage} from "./ui/pages/HomePage";
import {Parties} from "./ui/pages/Parties";

const router = createHashRouter([
    {
        path: "/",
        element: <Root/>,
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
