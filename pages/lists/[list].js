import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getCellDataFromApi } from '../../lib/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, TextField, Button } from '@mui/material';
import { useRouter } from 'next/router';
import CellsBarChart from '../../components/dataviz/CellsBarChart';
import Link from 'next/link';

function ListPage({ cells }) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCells, setFilteredCells] = useState(cells);

  useEffect(() => {
    const filtered = cells.filter(cell => cell.title.toLowerCase().includes(searchTerm.toLowerCase()) || cell.description.toLowerCase().includes(searchTerm.toLowerCase()) || cell.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    setFilteredCells(filtered);
  }, [searchTerm, cells]);

  const handleClickRow = (slug) => {
    router.push(`/cells/${slug}`);
  };

  const getColorByTag = (tag) => {
    const colors = ['#EE6352', '#59CD90', '#3FA7D6', '#FAC05E', '#F79D84', '#8E3C97', '#007EA7', '#007944', '#F9A03F', '#EFC7C2'];
    const numChars = tag.length;
    const index = numChars % colors.length;
    return colors[index];
  };
    
  

  const uniqueTags = [...new Set(cells.flatMap((cell) => cell.tags))];

  return (
    <Layout>
      <Box display="flex" justifyContent="flex-end">
        <Box mr={1}>
          <Link href={`/lists/${router.query.list}/stats`} passHref>
            <Button variant="contained" color="primary">Statistiques</Button>
          </Link>
        </Box>
      </Box>
      <Box display="flex" flexWrap="wrap" justifyContent="center" mt={10} mb={3}>
        <Box mr={10}>
          <TextField 
            label="Recherche"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
          />
        </Box>
        {uniqueTags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            style={{
              backgroundColor: getColorByTag(tag),
              color: 'white',
              marginRight: '0.5rem',
              marginBottom: '0.5rem',
              cursor: 'pointer',
            }}
            onClick={() => setSearchTerm(tag)}
          />
        ))}
      </Box>
      <TableContainer component={Paper} style={{ marginTop: '3rem', marginBottom: '3rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><h2>Titre</h2></TableCell>
              <TableCell><h2>Description</h2></TableCell>
              <TableCell><h2>Tags</h2></TableCell>
            </TableRow>
          </TableHead>
      <TableBody>
        {filteredCells.map((cell) => (
          <TableRow
            key={cell.slug}
            hover
            onClick={() => handleClickRow(cell.slug)}
            style={{ cursor: 'pointer' }}
          >
            <TableCell><h3>{cell.title}</h3></TableCell>
            <TableCell style={{ maxWidth: '350px' }}>{cell.description}</TableCell>
            <TableCell>
              {cell.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  style={{
                    backgroundColor: getColorByTag(tag),
                    color: 'white',
                    marginRight: '0.5rem',
                    marginBottom: '0.25rem',
                  }}
                />
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  <div style={{ maxHeight: "20rem" }}>
  <CellsBarChart data={CellsBarChart} filteredCells={filteredCells} />
  </div>
</Layout>

  );
}

export async function getStaticPaths() {
  const cells = await getCellDataFromApi();

  // Récupérez toutes les listes distinctes présentes dans les cellules
  const lists = new Set();
  cells.forEach(cell => {
    if (cell.lists) {
      cell.lists.forEach(list => lists.add(list));
    }
  });

  // Créez les chemins à partir des listes
  const paths = Array.from(lists).map(list => ({ params: { list } }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const cells = await getCellDataFromApi();

  // Filtrer les cellules ayant la propriété 'lists' contenant la valeur de la liste
  const filteredCells = cells.filter(cell => cell.lists && cell.lists.includes(params.list));

  return {
    props: {
      cells: filteredCells,
    },
  };
}

export default ListPage;