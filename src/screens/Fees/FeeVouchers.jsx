import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Typography,
  Card, CardContent, CardActions, Grid
} from '@mui/material';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function FeeVouchers() {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'feeVouchers'), snap =>
      setVouchers(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return vouchers.filter(r =>
      r.class?.toLowerCase().includes(q) ||
      r.period?.toLowerCase().includes(q)
    );
  }, [vouchers, search]);

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Fee Vouchers
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Search (Class / Period)"
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => navigate('/fees/add-voucher')}
        >
          Add Voucher
        </Button>
      </Box>

      <Grid container spacing={2}>
        {filtered.map(v => (
          <Grid item xs={12} sm={6} md={4} key={v.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{v.class} – {v.period}</Typography>
                <Typography>Amount: {v.amount}</Typography>
                <Typography>Due: {v.dueDate}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/fees/submission/${v.id}`)}
                >
                  Pay for Student
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}