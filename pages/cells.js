import React from 'react';
import Layout from '../components/Layout';
import { getCellDataFromApi } from '../lib/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { useRouter } from 'next/router';

export default function CellsPage({ cells }) {
  const router = useRouter();

  const handleClickRow = (slug) => {
    router.push(`/cells/${slug}`);
  };


  const getColorByTag = (tag) => {
    const firstLetter = tag.charAt(0).toUpperCase();
    const letters = '0123456789ABCDEF';
    let color = '#';
  
    // Utilisez la première lettre du tag pour déterminer un index de départ dans la chaîne 'letters'.
    const startIndex = letters.indexOf(firstLetter);
  
    // Générez une couleur hexadécimale en utilisant les lettres à partir de l'index de départ,
    // mais limitez la plage à des valeurs plus foncées en ajoutant un décalage.
    const darkRangeOffset = 5;
    for (let i = 0; i < 6; i++) {
      color += letters[((startIndex + i) % darkRangeOffset) + darkRangeOffset];
    }
  
    return color;
  };

  return (
    <Layout>
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
            {cells.map((cell) => (
              <TableRow
                key={cell.slug}
                hover
                onClick={() => handleClickRow(cell.slug)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell><h3>{cell.title}</h3></TableCell>
                <TableCell>{cell.description}</TableCell>
                <TableCell>
                  {cell.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      style={{
                        backgroundColor: getColorByTag(tag),
                        color: 'white',
                        marginRight: '0.5rem',
                      }}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
}

export async function getStaticProps() {
  const cells = await getCellDataFromApi();
  return {
    props: {
      cells,
    },
  };
}

