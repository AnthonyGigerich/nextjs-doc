import { useRouter } from 'next/router';
import TableAnalysis from '../../../components/products/TableAnalysis';
import Layout from '../../../components/Layout';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material';

export default function SearchCsv() {
  const router = useRouter();
  const { filename } = router.query;

  const [iframeCode, setIframeCode] = useState('');
  const [open, setOpen] = useState(false);

  const generateIframeCode = () => {
    const newIframeCode = `<iframe src="${window.location.origin}/products/search-csv/${filename}" width="100%" height="600px"></iframe>`;
    setIframeCode(newIframeCode);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Layout>
      <br></br>
      <Button onClick={generateIframeCode} variant="contained">
        Intégrer ce tableau
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Code d&apos;intégration</DialogTitle>
        <DialogContent>
          <TextField
            value={iframeCode}
            fullWidth={true}
            multiline={true}
            rows={6}
          />
          <Button onClick={handleClose} variant="contained">
            Fermer
          </Button>
        </DialogContent>
      </Dialog>
      <br></br>
      <br></br>
      <TableAnalysis filename={filename} maxRows={1000} />
    </Layout>
  );
}
