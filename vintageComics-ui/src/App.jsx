import { Outlet } from 'react-router-dom';
import Sidebar from './ui/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <h1>Welcome to Vintage Comics</h1>
      <p>This is the parent 'master' page.</p>
      
      <div>
        <Sidebar />
      </div>
      
      <hr />
      <div>
        <p>This is the child page:</p>
        <Outlet />
      </div>
    </>
  )
}

export default App
