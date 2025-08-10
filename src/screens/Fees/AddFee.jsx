import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { Box, Paper, TextField, Button, Grid, Typography } from '@mui/material';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function AddFee() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const params = new URLSearchParams(location.search);
  const editId = params.get('edit');

  const [values, setValues] = useState({ name: '', amount: '', dueDate: '' });

  useEffect(() => {
    if (editId) {
      (async () => {
        const snap = await getDoc(doc(db, 'fees', editId));
        if (snap.exists()) setValues(snap.data());
      })();
    }
  }, [editId]);
  const handleChange = e => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!values.name.trim() || !values.amount || !values.dueDate) return alert('Fill all fields');
    const data = { ...values, amount: Number(values.amount) };
    editId
      ? await updateDoc(doc(db, 'fees', editId), data)
      : await addDoc(collection(db, 'fees'), data);
    navigate('/fees/list');
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        {editId ? 'Edit Fee' : 'Add Fee'}
      </Typography>
      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField label="Name" name="name" value={values.name} onChange={handleChange} fullWidth required /></Grid>
            <Grid item xs={12}><TextField label="Amount" name="amount" type="number" value={values.amount} onChange={handleChange} fullWidth required /></Grid>
            <Grid item xs={12}><TextField label="Due Date" name="dueDate" type="date" value={values.dueDate} onChange={handleChange} fullWidth required /></Grid>
            <Grid item xs={12} textAlign="center"><Button type="submit" variant="contained">{editId ? 'Update' : 'Add'}</Button></Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}