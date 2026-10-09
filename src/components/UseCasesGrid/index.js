import React from "react";
import UseCaseCard from "@site/src/components/UseCaseCard";
import Divider from "@site/src/components/Layout/Divider";
import { UseCaseCategories } from "@site/src/data/use-cases";
import styles from "./styles.module.css";
import Grid from "@site/src/components/Layout/Grid";

export default function UseCasesGrid() {
  return (
    <section className={styles.useCasesSection}>
      {UseCaseCategories.map((category) => (
        <div key={category.id} className={styles.categoryBlock}>
          <Divider headingLevel={2} text={category.title} id={category.id} />
          <Grid stackOnMobile className={styles.grid}>
            {category.useCases.map((useCase) => (
              <UseCaseCard key={useCase.title} {...useCase} />
            ))}
          </Grid>
        </div>
      ))}
    </section>
  );
}
