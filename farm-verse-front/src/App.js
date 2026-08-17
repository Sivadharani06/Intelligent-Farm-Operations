import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import LoginPage from './Components/LoginComponent/LoginPage';
import RegisterUser from './Components/LoginComponent/RegisterUser'; 
import FarmerMenu from './Components/LoginComponent/FarmerMenu';
import FarmEntry from './Components/FarmCropComponent/FarmEntry';
import CropEntry from './Components/FarmCropComponent/CropEntry';
import FarmList from './Components/FarmCropComponent/FarmList';
import CropList from './Components/FarmCropComponent/CropList';
import FarmCropReport from './Components/FarmCropComponent/FarmCropReport';
import AgroExpenseEntry from './Components/AgroExpenseComponent/AgroExpenseEntry';
import CropInputView from './Components/AgroExpenseComponent/CropInputView';
import CropExpenseView from './Components/AgroExpenseComponent/CropExpenseView';
import AgroExpenseList from './Components/AgroExpenseComponent/AgroExpenseList';
function App() {
  return (
    <div className="App">
      
     <BrowserRouter>
      <Routes>
       <Route path="/" element={<LoginPage/>}/>
       <Route path="/register" element={<RegisterUser/>}/>
       <Route path="/farmer-menu"element={<FarmerMenu/>}/>
       <Route path="/farm-add" element={<FarmEntry/>}/>
       <Route path="/farm-list" element={<FarmList/>}/>
       <Route path="/crop-add" element={<CropEntry/>}/>
       <Route path="/crop-list" element={<CropList/>}/>
       <Route path="/farm-crop/:cid" element={<FarmCropReport/>}/>
       <Route path="/crop-input/:cid" element={<CropInputView/>}/>
       <Route path="/crop-expense/:cid" element={<CropExpenseView/>}/>
       <Route path="/expense-add" element={<AgroExpenseEntry/>}/>
       <Route path="/expense-list" element={<AgroExpenseList/>}/>
       </Routes>
       
      </BrowserRouter>
    </div>
  );
}

export default App;
