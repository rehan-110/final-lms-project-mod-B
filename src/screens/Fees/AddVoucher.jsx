import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Grid, Typography, MenuItem
} from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const periods = ['Monthly', 'Yearly'];

export default function AddVoucher() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    class: '',
    period: '',
    amount: '',
    dueDate: ''
  });

  const handleChange = e =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!values.class || !values.period || !values.amount || !values.dueDate) {
      alert('Fill all fields');
      return;
    }
    await addDoc(collection(db, 'feeVouchers'), {
      ...values,
      amount: Number(values.amount),
      createdAt: new Date()
    });
    navigate('/fees/vouchers');
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Add Voucher
      </Typography>
      <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Class"
                name="class"
                value={values.class}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Period"
                name="period"
                value={values.period}
                onChange={handleChange}
                fullWidth
                required
              >
                {periods.map(p => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={values.amount}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Due Date"
                name="dueDate"
                type="date"
                value={values.dueDate}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Button type="submit" variant="contained">
                Create Voucher
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}