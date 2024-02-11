import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import SiteHero from "@site/src/components/Basic/sitehero";

 
import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
 
const ColoredText = styled(Box)`
margin:0rem 0 0 0;
max-width:60rem;
margin:0;
h3 {
  color:#3b7982;
  em {
    font-style:normal;
    color:#ff5553;
  }
}
`

{/*
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
*/}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <SiteHero
        title='Example Components'
        description='Check out these example components'
        bannerType ='fluid'
      />
      <main>
        <HomepageFeatures />

        {/* Some Material UI Components, get full overview: https://mui.com/material-ui/all-components/ */}
        <Button variant="contained">Contained Button</Button>
        <Button variant="text">Text Button</Button>
        <Button variant="outlined">Outlined Button</Button>
        
        {/* Some Material UI Components, get full overview: https://mui.com/material-ui/react-grid/ 
        <Grid container spacing={2}>
          <Grid item xs={6} md={8}>
            <Item>xs=6 md=8</Item>
          </Grid>
          <Grid item xs={6} md={4}>
            <Item>xs=6 md=4</Item>
          </Grid>
          <Grid item xs={6} md={4}>
            <Item>xs=6 md=4</Item>
          </Grid>
          <Grid item xs={6} md={8}>
            <Item>xs=6 md=8</Item>
          </Grid>
        </Grid>*/}

        {/* Tests */}
        <Grid container spacing={5}>
            <Grid item md={6}>
              <Box paddingTop={0} paddingBottom={1}>
                <Typography component='div'>
                  Cardano is defined by its community. Its governance model shows that true democracy - in which individuals are incentivized to play a role and votes are immutably recorded - is possible. It is a way for token holders to decide the future of a platform, and for the community to dictate the use of Cardano’s treasury funds.
                </Typography>
              </Box>
              <Box paddingTop={0}>
                <Typography variant='body2' component='div'>
                This model and the pioneering technology that underpins it can be applied to any application, system, or even society. It is a blueprint for change that is decided by the many, as well as the few, and which will redistribute power, eliminating intermediaries, to improve the lives of all.
                </Typography>
              </Box>
              <Box paddingTop={3}>
                <Button component={Link} variant='contained' color='primary' href='https://forum.cardano.org/c/governance/140'>'Participate'</Button>
              </Box>
            </Grid>
            <Grid item md={6}>
              <ColoredText paddingTop={9} paddingBottom={1}>
                <Typography component='div'>
                *Change begins with one voice -* but is realized through the combination of many 
                </Typography>
              </ColoredText>
            </Grid>
          </Grid>
 
      </main>
    </Layout>
  );
}
