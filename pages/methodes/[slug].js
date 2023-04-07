// pages/methodes/[slug].js

import ReactMarkdown from 'react-markdown';
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getMethodBySlug, getAllMethodSlugs, getUsagesBySlugs, getDatasetsBySlugs, getAllTagsForSlug, getTypeForSlug, getLastupdateForSlug } from '../../lib/markdown';
import { useTheme } from '@mui/material/styles';
import {Box, Grid, Typography, Button, Container } from '@mui/material';
import UsageGallery from '../../components/UsageGallery';
import Link from 'next/link';
import ApiOpenDataSources from '../../components/ApiOpenDataSources';
import DiscussionLinks from '../../components/DiscussionLinks';
import MethodNext from '../../components/MethodNext';
import TagSystem from '../../components/TagSystem';
import MetadataTable from '../../components/MetadataTable';


export default function MethodPage({ method, usages, datasets, tags }) {

  useEffect(() => {
    console.log("Method tags: ", method.tags); 

  }, [method]);

  const theme = useTheme();

  const markdownComponents = {
    p: ({ children }) => <Typography paragraph>{children}</Typography>,
    h1: ({ children }) => (
      <Typography variant="h1" gutterBottom sx={theme.components.MuiTypography.styleOverrides.h1}>
        {children}
      </Typography>
    ),
    h2: ({ children }) => (
      <Typography variant="h2" gutterBottom sx={theme.components.MuiTypography.styleOverrides.h2}>
        {children}
      </Typography>
    ),
    h3: ({ children }) => (
      <Typography variant="h3" gutterBottom sx={theme.components.MuiTypography.styleOverrides.h3}>
        {children}
      </Typography>
    ),
    // Faites de même pour les autres éléments (h4, h5, h6)
    blockquote: ({ children }) => (
      <Typography
        component="blockquote"
        variant="subtitle1"
        sx={{
          borderLeft: '3px solid #173541',
          paddingLeft: '1rem',
          fontStyle: 'italic',
          color: '#616161',
        }}
      >
        {children}
      </Typography>
    ),
  };
  

  return (
    <Layout>
      <Box sx={{ mt: '2rem', mb: '2rem', ml: '1rem' }}>
        <Grid container spacing={1}>
          <Grid item xs={10} sm={12} md={3} sx={{ display: { xs: 'flex', md: 'flex' } }}>
            <Box sx={{ bgcolor: '#FFF1EB', p: 2, position: 'flex', top: 50, left: 0, width: '120%', ml: '-7rem', paddingLeft: '2rem' }}>
              <MetadataTable
                metadata={{
                  Type: method.type,
                  Description: method.description,
                  'Dernière mise à jour': method.lastupdate,
                }}
              />
              {method.collection && (
                <Box sx={{
                  bgcolor: '#FFF1EB',
                  mb: '1rem',
                  mt: '1rem',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}>
                  <Typography
                    variant="h4"
                    align="center"
                    fontWeight={600}
                    sx={{ marginLeft: '1rem' }}
                    gutterBottom
                  >
                    Patchwork&nbsp;
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', width: '90%' }}>
                    <Button
                      variant="contained"
                      href={`/collections/${method.collection}`}
                      sx={{
                        backgroundColor: '#fff',
                        borderColor: '#000',
                        borderWidth: '0.3px',
                        borderStyle: 'solid',
                        borderRadius: '10px',
                        color: '#000',
                        fontWeight: 'regular',
                        fontSize: '0.9rem',
                        textAlign: 'left',
                        marginBottom: '-0.5rem',
                        marginLeft: '1rem', 
                        width: '100%',
                        justifyContent: 'flex-start', 
                        '&:hover': {
                          backgroundColor: '#E95459',
                          color: '#fff',
                        },
                      }}
                    >
                      📂 Patchwork {method.collection}
                    </Button>
                    <Typography
                      variant="h5"
                      align="left"
                      fontWeight={600}
                      sx={{ marginLeft: '1rem' }}
                      gutterBottom
                    >
                      <br></br>
                      Méthode suivante&nbsp;
                    </Typography>
                    {method.next_method && (
                      <MethodNext
                        nextMethodSlug={method.next_method.slug}
                        nextMethodTitle={method.next_method.title}
                      />
                    )}
                  </Box>
                </Box>
              )}
              <DiscussionLinks discourseIds={method.discourse_id} />
              <Link href="/methodes">
                <Button
                  variant="contained"
                  sx={{
                    mt: '2rem',
                    ml: '1rem',
                    backgroundColor: '#173541',
                    borderRadius: '10px',
                    borderWidth: '3px',
                    borderColor: '#000000',
                    color: '#fff',
                    fontWeight: 'regular',
                    '&:hover': {
                      backgroundColor: '#E95459',
                      color: '#ffffff',
                    },
                  }}
                >
                  Toutes les méthodes
                </Button>
              </Link>
              <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.5rem', mt: '3rem', ml: '1rem' }}>
                <TagSystem tags={tags} onClickTag={(tag) => console.log(tag)} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={9}>
            <Container maxWidth="lg" sx={{ ml: '0rem' }}>
              <Typography variant="h1" align="left" gutterBottom sx={{ fontSize: '4rem' }}>
                {method.title}
              </Typography>
              <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                  {method.image && (
                    <img src={method.image} alt={method.title} style={{
                      height: '250px',
                      width: '600px',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }} />
                  )}
                  <ReactMarkdown components={markdownComponents}>
                    {method.content}
                  </ReactMarkdown>

                  {method.usages && method.usages.length > 0 && <UsageGallery usages={usages} />}
                  <>
                    <br></br>
                    <br></br>
                    {method.datasets && method.datasets.length > 0 && (
                      <>
                        <br />
                        <br />
                        <ApiOpenDataSources datasetsList={datasets} />
                      </>
                    )}
                  </>
                </Grid>
              </Grid>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export async function getStaticPaths() {
  const slugs = getAllMethodSlugs();
  const paths = slugs.map((slug) => ({ params: { slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const method = getMethodBySlug(slug);
  const usages = getUsagesBySlugs(method.usages);
  const datasets = getDatasetsBySlugs(method.datasets);
  const tags = getAllTagsForSlug(slug, method.tags);
  const type = getTypeForSlug(slug);
  const lastupdate = getLastupdateForSlug(method.slug);
  

  return {
    props: {
      method,
      usages,
      datasets,
      tags,
      type,
      lastupdate,
    },
  };
}
