import { Outlet } from 'react-router-dom';
import Nav from './ui/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <h1>Welcome to Vintage Comics</h1>
      <br />
      
      <div>
        <Nav />
      </div>
      
      <hr />
      <div>
        <Outlet />
      </div>
    </>
  )
}

export default App
