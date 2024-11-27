
function App() {

  const apiHost = import.meta.env.VITE_APP_HOST;

  return (
    <div>
      <h1>Welcome to Vintage Comics</h1>
      <p>API host = {apiHost}</p>
    </div>
  );
}

export default App;
