import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Button, TextField, Grid, MenuItem
} from '@mui/material';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const paymentMethods = ['Cash', 'Bank Transfer', 'UPI', 'Card'];

export default function FeeSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);

  const [studentName, setStudentName] = useState('');
  const [rollNo, setRollNo]         = useState('');
  const [email, setEmail]           = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading]       = useState(false);

  useState(() => {
    (async () => {
      const snap = await getDoc(doc(db, 'feeVouchers', id));
      if (snap.exists()) setVoucher(snap.data());
    })();
  }, [id]);

  if (!voucher) return <Typography align="center">Loading voucher…</Typography>;

  const handlePay = async () => {
    if (!studentName.trim() || !rollNo.trim() || !email.trim()) {
      alert('Please fill all student details');
      return;
    }
    setLoading(true);

    await addDoc(collection(db, 'payments'), {
      voucherId: id,
      studentName,
      rollNo,
      email,
      paymentMethod,
      amount: voucher.amount,
      paidAt: new Date()
    });

    alert('Payment successful');
    navigate('/fees/vouchers');
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Fee Submission
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
        <Typography><strong>Class:</strong> {voucher.class}</Typography>
        <Typography><strong>Period:</strong> {voucher.period}</Typography>
        <Typography><strong>Amount:</strong> ${voucher.amount}</Typography>
        <Typography><strong>Due Date:</strong> {voucher.dueDate}</Typography>

        <Box mt={3} component="form" noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Student Name"
                fullWidth
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Roll No"
                fullWidth
                value={rollNo}
                onChange={e => setRollNo(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Payment Method"
                fullWidth
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
              >
                {paymentMethods.map(m => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Box mt={3} textAlign="center">
            <Button
              variant="contained"
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? 'Processing…' : 'Pay Now'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}