import React from 'react'
import Query from '../../queries/GovernancePageQuery'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import Section from '../Layout/Section'
import Markdown from '@input-output-hk/front-end-core-components/components/Markdown'
import Button from '@material-ui/core/Button'
import Link from '@input-output-hk/front-end-core-components/components/Link'

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

export default () => {
  return (
    <Query
      render={(content) => (
        <Section id={content.governance.governance_slug} label={content.governance.governance_title}>
          <Grid container spacing={5}>
            <Grid item md={6}>
              <Box paddingTop={0} paddingBottom={1}>
                <Typography component='div'>
                  <Markdown source={content.governance.governance_desc_top} />
                </Typography>
              </Box>
              <Box paddingTop={0}>
                <Typography variant='body2' component='div'>
                  <Markdown source={content.governance.governance_desc_bottom} />
                </Typography>
              </Box>
              <Box paddingTop={3}>
                <Button component={Link} variant='contained' color='primary' href={content.governance.governance_desc_link_href}>{content.governance.governance_decs_link_label}</Button>
              </Box>
            </Grid>
            <Grid item md={6}>
              <ColoredText paddingTop={9} paddingBottom={1}>
                <Typography component='div'>
                  <Markdown source={content.governance.governance_claim} />
                </Typography>
              </ColoredText>
            </Grid>
          </Grid>
        </Section>
      )}
    />
  )
}
