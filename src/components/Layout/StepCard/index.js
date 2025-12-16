import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";

const STORAGE_KEY = 'cardano-get-started-step';

/**
 * StepIndicator - Displays the current step number out of total steps
 */
function StepIndicator({ currentStep, totalSteps, onReset }) {
  return (
    <div className={styles.stepIndicatorWrapper}>
      <div className={styles.stepIndicator}>
        {currentStep} / {totalSteps}
      </div>
      {currentStep > 1 && (
        <button onClick={onReset} className={styles.resetButton} title="Start over">
          Start over
        </button>
      )}
    </div>
  );
}

/**
 * StepCard - A component for creating multi-step guided experiences
 * 
 * @param {Object} props
 * @param {Array} props.steps - Array of step objects with title, description, content, checkboxLabel, hideHeader, hideActions, and finalStep properties
 * @param {number} props.initialStep - Starting step number (default: 1)
 * @param {Function} props.onStepChange - Callback function called when step changes
 * @param {boolean} props.walletConnected - External state to auto-check wallet connection step
 */
export default function StepCard({ steps = [], initialStep = 1, onStepChange, walletConnected }) {
  // Load saved step from localStorage
  const getSavedStep = () => {
    if (typeof window === 'undefined') return initialStep;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? parseInt(saved, 10) : initialStep;
    } catch (e) {
      return initialStep;
    }
  };

  const [currentStep, setCurrentStep] = useState(getSavedStep);
  const [checked, setChecked] = useState(false);

  // Save step to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, currentStep.toString());
      } catch (e) {
        console.error('Failed to save step to localStorage', e);
      }
    }
  }, [currentStep]);

  // Auto-check the checkbox when wallet is connected on step 4
  React.useEffect(() => {
    if (currentStep === 4 && walletConnected) {
      setChecked(true);
    }
  }, [currentStep, walletConnected]);

  const handleContinue = (isChecked, moveNext = false) => {
    setChecked(isChecked);
    if (moveNext && isChecked) {
      const nextStep = Math.min(currentStep + 1, steps.length);
      setCurrentStep(nextStep);
      setChecked(false);
      if (onStepChange) {
        onStepChange(nextStep);
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setChecked(false);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Failed to clear localStorage', e);
      }
    }
    if (onStepChange) {
      onStepChange(1);
    }
  };

  const currentStepData = steps[currentStep - 1];

  if (!currentStepData) {
    return null;
  }

  // Render step actions that can be used in content
  const stepActions = !currentStepData.finalStep && currentStepData.checkboxLabel && (
    <div className={styles.stepActions}>
      <label className={styles.checkboxLabel}>
        <input 
          type="checkbox" 
          onChange={(e) => handleContinue(e.target.checked)}
          checked={checked}
          disabled={currentStep === 4}
        />
        <span>{currentStepData.checkboxLabel}</span>
      </label>
      <button 
        className={styles.continueButton} 
        disabled={!checked}
        onClick={() => handleContinue(true, true)}
      >
        Continue
      </button>
    </div>
  );

  return (
    <div className={styles.stepCard}>
      <StepIndicator currentStep={currentStep} totalSteps={steps.length} onReset={handleReset} />
      {!currentStepData.hideHeader && (
        <>
          <h2>{currentStepData.title}</h2>
          <p className={styles.stepDescription}>{currentStepData.description}</p>
        </>
      )}
      
      <div className={styles.stepContentWrapper}>
        {typeof currentStepData.content === 'function' 
          ? currentStepData.content(stepActions) 
          : currentStepData.content
        }
      </div>

      {!currentStepData.hideActions && stepActions}
    </div>
  );
}
