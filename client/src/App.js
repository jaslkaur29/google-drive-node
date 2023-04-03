import './App.css';
import ReadFile from './ReadFile';
import UploadFile from './UploadFile';
import NavBar from './Navbar';

function App() {
  return (
    <div className = "App">
      <NavBar></NavBar>
      <ReadFile></ReadFile>
      <UploadFile></UploadFile>
    </div>
  );
}

export default App;
