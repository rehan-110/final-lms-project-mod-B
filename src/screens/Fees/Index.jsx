import { Routes, Route } from 'react-router-dom';
import FeeList        from './FeeList';
import AddFee         from './AddFee';
import FeeVouchers    from './FeeVouchers';
import AddVoucher     from './AddVoucher';
import FeeSubmission  from './FeeSubmission';
import SubmitFee      from './SubmitFee';
export default function Fees() {
  return (
    <Routes>
      <Route path="list"        element={<FeeList />} />
      <Route path="add"         element={<AddFee />} />
      <Route path="vouchers"    element={<FeeVouchers />} />
      <Route path="add-voucher" element={<AddVoucher />} />
      <Route path="submission/:id" element={<FeeSubmission />} />
       <Route path="submit-fee"  element={<SubmitFee />} />
    </Routes>
  );
}