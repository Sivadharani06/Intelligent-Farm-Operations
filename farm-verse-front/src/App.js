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
import FinalCropReport from './Components/FarmCropComponent/FinalCropReport';
import CropProfitReport from './Components/FarmCropComponent/CropProfitReport';
import CropInputView from './Components/AgroExpenseComponent/CropInputView';
import AgroExpenseList from './Components/AgroExpenseComponent/AgroExpenseList';
import AgroExpenseEntry from './Components/AgroExpenseComponent/AgroExpenseEntry';
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
       <Route path="/farm-crop" element={<FarmCropReport/>}/>
       <Route path="/yield-predictions" element={<FarmCropReport/>}/>
       <Route path="/yield-predictions/:cid" element={<FarmCropReport/>}/>

       <Route path="/final-crop-report/:cid" element={<FinalCropReport/>}/>
       <Route path="/final-crop-report" element={<FinalCropReport/>}/>
       <Route path="/final-crop-reports" element={<FinalCropReport/>}/>
       <Route path="/final-crop-reports/:cid" element={<FinalCropReport/>}/>

       <Route path="/crop-profit-report/:cid" element={<CropProfitReport/>}/>
       <Route path="/crop-profit-report" element={<CropProfitReport/>}/>
       <Route path="/crop-profit-reports" element={<CropProfitReport/>}/>
       <Route path="/crop-profit-reports/:cid" element={<CropProfitReport/>}/>

       <Route path="/crop-input/:cid" element={<CropInputView/>}/>
       <Route path="/crop-input" element={<CropInputView/>}/>
       <Route path="/crop-inputs" element={<CropInputView/>}/>
       <Route path="/crop-inputs/:cid" element={<CropInputView/>}/>
       <Route path="/expense-list" element={<AgroExpenseList/>}/>
       <Route path="/expense-add" element={<AgroExpenseEntry/>}/>
       </Routes>
       
      </BrowserRouter>
    </div>
  );
}

export default App;
