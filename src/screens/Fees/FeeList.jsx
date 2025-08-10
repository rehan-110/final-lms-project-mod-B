import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function FeeList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    return onSnapshot(collection(db, 'fees'), snap =>
      setRows(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(r => r.name?.toLowerCase().includes(q) || r.amount?.toString().includes(q));
  }, [rows, search]);

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>Fee List</Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField label="Search fees" size="small" value={search} onChange={e => setSearch(e.target.value)} />
        <Button variant="contained" onClick={() => navigate('/fees/add')}>Add Fee</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow><TableCell>Name</TableCell><TableCell>Amount</TableCell><TableCell>Due Date</TableCell><TableCell align="center">Actions</TableCell></TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell><TableCell>{r.amount}</TableCell><TableCell>{r.dueDate}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => navigate(`/fees/add?edit=${r.id}`)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={async () => await deleteDoc(doc(db, 'fees', r.id))}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={filtered.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} />
      </TableContainer>
    </Box>
  );
}