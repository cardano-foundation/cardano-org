import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import IconHero from '@site/src/components/Layout/IconHero';
import SurveyModal from '../SurveyModal';
import styles from './styles.module.css';

const SurveyCard = ({
  surveyData,
  title = 'Not sure where to start?',
  description,
  buttonText = 'Find your role',
  questionCount,
  icon,
  secondaryButtonText,
  secondaryButtonHref,
}) => {
  const hasIcon = !!icon;
  return (
    <div className={clsx(styles.card, hasIcon && styles.cardWithIcon)}>
      {hasIcon && (
        <IconHero className={styles.cardIcon}>
          {icon}
        </IconHero>
      )}
      <div className={styles.cardBody}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <div className={styles.cardActions}>
        <SurveyModal
          surveyData={surveyData}
          buttonText={buttonText}
          questionCount={questionCount}
          buttonClassName={clsx("button button--primary button--lg", styles.primaryButton)}
        />
        {secondaryButtonText && secondaryButtonHref && (
          <Link
            to={secondaryButtonHref}
            className={clsx("button button--outline button--primary button--lg", styles.secondaryButton)}
          >
            {secondaryButtonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default SurveyCard;
