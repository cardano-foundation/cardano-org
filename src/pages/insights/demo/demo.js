import React, { useEffect, useRef } from 'react';
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import OpenGraphImage from "@site/src/components/Layout/OpenGraphImage";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import * as d3 from 'd3';
import authors from '@site/src/data/authors.json';
import InsightsHeader from '@site/src/components/Layout/InsightsHeader';

function HomepageHeader() {
  return (
    <SiteHero
      title="Data-Driven Insights"
      description="Explore key metrics, trends, and deep analytics shaping the Cardano ecosystem."
      bannerType="zoom"
    />
  );
}

export default function CustomBlogLikePage() {
  const d3Container = useRef(null);

  // Set author as in author.yml
  const author = authors?.['cf'];

  useEffect(() => {
    if (d3Container.current) {
      const svg = d3
        .select(d3Container.current)
        .attr('width', 300)
        .attr('height', 300);

      svg
        .append('circle')
        .attr('cx', 150)
        .attr('cy', 150)
        .attr('r', 80)
        .style('fill', '#4e79a7');
    }
  }, []);

  const formattedDate = new Date('2025-03-17').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    
    <Layout title="D3 Demo in Blog-Post Style" description="A blog-like layout with D3 in Docusaurus">
      <OpenGraphImage pageName="network" />
      <HomepageHeader />
      <main className="container margin-vert--lg">
        <article className="padding--lg">
          {/* Blog Title */}
          <InsightsHeader 
          title="D3 Demo in Blog-Post Style" 
          date={formattedDate} 
          author={author} 
        />

          {/* Blog content */}
          <div className="markdown">
            <p>This is a blog-like article with a D3 graphic:</p>
            <div>
              <svg ref={d3Container}></svg>
            </div>
            <p>And here is more text below the graphic.</p>
          </div>
        </article>
      </main>
    </Layout>
  );
}