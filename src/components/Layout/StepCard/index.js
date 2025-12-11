import React, { useState } from "react";
import styles from "./styles.module.css";

/**
 * StepIndicator - Displays the current step number out of total steps
 */
function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className={styles.stepIndicator}>
      {currentStep} / {totalSteps}
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
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [checked, setChecked] = useState(false);

  // Auto-check the checkbox when wallet is connected on step 3
  React.useEffect(() => {
    if (currentStep === 3 && walletConnected) {
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
          disabled={currentStep === 3}
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
      <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
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
