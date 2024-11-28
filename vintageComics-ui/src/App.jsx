import { Outlet } from 'react-router-dom';
import Nav from './ui/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <h1>Welcome to Vintage Comics</h1>
      <p>This is the navigation bar.</p>
      
      <div>
        <Nav />
      </div>
      
      <hr />
      <div>
        <p>This is the gallery:</p>
        <Outlet />
      </div>
    </>
  )
}

export default App
