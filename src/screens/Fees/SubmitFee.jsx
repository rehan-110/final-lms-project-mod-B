import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, TextField, Grid, MenuItem } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const periods = ['Monthly', 'Quarterly', 'Yearly'];

export default function SubmitFee() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    studentName: '',
    rollNo: '',
    studentClass: '',
    period: '',
    amount: '',
    dueDate: ''
  });

  const handleChange = e =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const { studentName, rollNo, studentClass, period, amount, dueDate } = values;
    if (!studentName || !rollNo || !studentClass || !period || !amount || !dueDate) {
      alert('Fill all fields');
      return;
    }

    await addDoc(collection(db, 'payments'), {
      studentName,
      rollNo,
      studentClass,
      period,
      amount: Number(amount),
      dueDate,
      paidAt: new Date(),
      status: 'Paid'
    });

    alert('Fee paid successfully');
    navigate('/fees/list');
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Submit Fee
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Student Name"
                name="studentName"
                value={values.studentName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Roll No"
                name="rollNo"
                value={values.rollNo}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Class"
                name="studentClass"
                value={values.studentClass}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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
                Pay Fee
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}