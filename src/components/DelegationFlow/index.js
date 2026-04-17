import React, { useEffect, useState } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { translate } from "@docusaurus/Translate";
import {
  FaArrowRight,
  FaCheck,
  FaLock,
  FaPenNib,
  FaShieldAlt,
  FaUsers,
  FaWallet,
  FaRegSun,
} from "react-icons/fa";
import styles from "./styles.module.css";

const DEFAULT_STORAGE_KEY = "cardano-governance-delegation-step";

const POPULAR_WALLETS = [
  { id: "eternl", name: "Eternl", icon: "/img/wallets/eternl-ada.svg" },
  { id: "lace", name: "Lace", icon: "/img/wallets/lace-ada.svg" },
  { id: "yoroi", name: "Yoroi", icon: "/img/wallets/yoroi-ada.svg" },
];

function useStepState(storageKey) {
  const [currentStep, setCurrentStep] = useState(1);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setCurrentStep(parseInt(saved, 10) || 1);
    } catch (e) {
      /* noop */
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(storageKey, String(currentStep));
    } catch (e) {
      /* noop */
    }
  }, [currentStep, storageKey]);

  return { currentStep, setCurrentStep, checked, setChecked };
}

function StepperItem({ index, label, hint, Icon, state, onClick }) {
  const isCurrent = state === "current";
  const isDone = state === "done";
  const isUpcoming = state === "upcoming";

  const className = [
    styles.stepperItem,
    isCurrent && styles.stepperItemCurrent,
    isDone && styles.stepperItemDone,
    isUpcoming && styles.stepperItemUpcoming,
    isDone && styles.stepperItemClickable,
  ]
    .filter(Boolean)
    .join(" ");

  const circleClass = [
    styles.stepCircle,
    isCurrent && styles.stepCircleCurrent,
    isDone && styles.stepCircleDone,
  ]
    .filter(Boolean)
    .join(" ");

  const Tag = isDone ? "button" : "div";
  const tagProps = isDone ? { type: "button", onClick } : {};

  return (
    <li>
      <Tag className={className} {...tagProps}>
        <span className={circleClass} aria-hidden="true">
          {isDone ? <FaCheck size={12} /> : index}
        </span>
        <Icon className={styles.stepIcon} aria-hidden="true" />
        <span className={styles.stepText}>
          <span className={styles.stepLabel}>{label}</span>
          <span className={styles.stepHint}>{hint}</span>
        </span>
      </Tag>
    </li>
  );
}

function Stepper({ currentStep, onJump, onReset }) {
  const items = [
    {
      label: translate({ id: "governance.delegation.step1.stepperLabel", message: "Wallet" }),
      hint: translate({ id: "governance.delegation.stepper.hint.wallet", message: "Get a compatible wallet" }),
      Icon: FaWallet,
    },
    {
      label: translate({ id: "governance.delegation.step2.stepperLabel", message: "DRep" }),
      hint: translate({ id: "governance.delegation.stepper.hint.drep", message: "Choose a DRep" }),
      Icon: FaUsers,
    },
    {
      label: translate({ id: "governance.delegation.step3.stepperLabel", message: "Delegate" }),
      hint: translate({ id: "governance.delegation.stepper.hint.delegate", message: "Sign delegation transaction" }),
      Icon: FaPenNib,
    },
    {
      label: translate({ id: "governance.delegation.step4.stepperLabel", message: "Done" }),
      hint: translate({ id: "governance.delegation.stepper.hint.done", message: "Your delegation is active" }),
      Icon: FaCheck,
    },
  ];

  return (
    <div className={styles.stepperCol}>
      <ol className={styles.stepperList}>
        <span className={styles.stepperLine} aria-hidden="true" />
        {items.map((item, i) => {
          const index = i + 1;
          let state = "upcoming";
          if (index < currentStep) state = "done";
          else if (index === currentStep) state = "current";
          return (
            <StepperItem
              key={item.label}
              index={index}
              label={item.label}
              hint={item.hint}
              Icon={item.Icon}
              state={state}
              onClick={() => onJump(index)}
            />
          );
        })}
      </ol>
      {currentStep > 1 && (
        <button type="button" className={styles.resetButton} onClick={onReset}>
          {translate({ id: "governance.delegation.startOver", message: "Start over" })}
        </button>
      )}
    </div>
  );
}

function WalletChips() {
  return (
    <>
      <div className={styles.walletChips}>
        {POPULAR_WALLETS.map((w) => (
          <Link key={w.id} to="/wallets" className={styles.walletChip} aria-label={w.name}>
            <img src={useBaseUrl(w.icon)} alt={w.name} className={styles.walletChipIcon} />
            <FaArrowRight className={styles.walletChipArrow} aria-hidden="true" />
          </Link>
        ))}
      </div>
      <Link to="/wallets" className={styles.browseAll}>
        {translate({ id: "governance.delegation.step1.browseAll", message: "Browse all wallets" })}
        <FaArrowRight size={12} aria-hidden="true" />
      </Link>
    </>
  );
}

function FeatureTile({ Icon, title, hint, to }) {
  return (
    <Link to={to} className={styles.featureTile}>
      <span className={styles.featureTileIcon} aria-hidden="true">
        <Icon />
      </span>
      <span className={styles.featureTileText}>
        <span className={styles.featureTileTitle}>{title}</span>
        <span className={styles.featureTileHint}>{hint}</span>
      </span>
      <FaArrowRight className={styles.featureTileArrow} aria-hidden="true" />
    </Link>
  );
}

function StepOne() {
  return (
    <>
      <p className={styles.panelDescription}>
        {translate({
          id: "governance.delegation.step1.text",
          message: "Most popular Cardano wallets support governance delegation. If you already have a wallet with ada, you are ready to go.",
        })}
      </p>
      <div className={styles.stepVisual}>
        <WalletChips />
      </div>
    </>
  );
}

function StepTwo() {
  return (
    <>
      <p className={styles.panelDescription}>
        {translate({
          id: "governance.delegation.step2.text",
          message: "DReps publish their platform and voting intentions. Choose one whose priorities match yours, or pick an automatic option (Abstain or No Confidence).",
        })}
      </p>
      <div className={styles.stepVisual}>
        <FeatureTile
          Icon={FaUsers}
          title={translate({ id: "governance.delegation.step2.featureTitle", message: "Browse DReps" })}
          hint={translate({ id: "governance.delegation.step2.featureHint", message: "Compare platforms, voting power and activity" })}
          to="/governance/delegate"
        />
      </div>
    </>
  );
}

function StepThree() {
  return (
    <>
      <p className={styles.panelDescription}>
        {translate({
          id: "governance.delegation.step3.text",
          message: "Connect your wallet, pick your DRep, and sign one transaction. Your ada stays in your wallet at all times.",
        })}
      </p>
      <div className={styles.stepVisual}>
        <div className={styles.reassurance}>
          <FaLock aria-hidden="true" />
          {translate({ id: "governance.delegation.reassurance", message: "Your ada never leaves your wallet" })}
        </div>
        <FeatureTile
          Icon={FaPenNib}
          title={translate({ id: "governance.delegation.step3.featureTitle", message: "Open delegation tool" })}
          hint={translate({ id: "governance.delegation.step3.featureHint", message: "Connect wallet and sign one transaction" })}
          to="/governance/delegate"
        />
      </div>
    </>
  );
}

function StepFour() {
  return (
    <>
      <p className={styles.panelDescription}>
        {translate({
          id: "governance.delegation.step4.text",
          message: "Your voting power is now represented by your DRep. You can change your delegation at any time — your ada stays fully under your control.",
        })}
      </p>
      <div className={styles.doneVisual}>
        <div className={styles.doneCheck} aria-hidden="true">
          <FaCheck />
        </div>
        <div className={styles.doneThanks}>
          {translate({
            id: "governance.delegation.done.thanks",
            message: "Thank you for participating in on-chain governance and helping shape Cardano's future.",
          })}
        </div>
        <div className={styles.doneCtas}>
          <Link to="/governance/delegate" className="button button--outline button--primary">
            {translate({ id: "governance.delegation.done.cta.delegation", message: "View my delegation" })}
          </Link>
          <Link to="/governance#impact" className="button button--primary">
            {translate({ id: "governance.delegation.done.cta.explore", message: "Explore governance" })}
          </Link>
        </div>
      </div>
    </>
  );
}

const STEPS = [
  {
    title: translate({ id: "governance.delegation.step1.title", message: "Get a compatible wallet" }),
    heroIcon: FaWallet,
    render: () => <StepOne />,
    checkbox: translate({ id: "governance.delegation.step1.checkbox", message: "I have a wallet with ada" }),
    ready: translate({ id: "governance.delegation.step1.ready", message: "Wallet ready" }),
  },
  {
    title: translate({ id: "governance.delegation.step2.title", message: "Find a DRep" }),
    heroIcon: FaUsers,
    render: () => <StepTwo />,
    checkbox: translate({ id: "governance.delegation.step2.checkbox", message: "I have chosen a DRep" }),
    ready: translate({ id: "governance.delegation.step2.ready", message: "DRep chosen" }),
  },
  {
    title: translate({ id: "governance.delegation.step3.title", message: "Delegate your voting power" }),
    heroIcon: FaPenNib,
    render: () => <StepThree />,
    checkbox: translate({ id: "governance.delegation.step3.checkbox", message: "I have delegated my voting power" }),
    ready: translate({ id: "governance.delegation.step3.ready", message: "Delegation signed" }),
  },
  {
    title: translate({ id: "governance.delegation.step4.title", message: "You're done!" }),
    heroIcon: FaCheck,
    render: () => <StepFour />,
    isFinal: true,
  },
];

export default function DelegationFlow({ storageKey = DEFAULT_STORAGE_KEY }) {
  const { currentStep, setCurrentStep, checked, setChecked } = useStepState(storageKey);
  const step = STEPS[currentStep - 1];
  if (!step) return null;

  const handleJump = (n) => {
    if (n < currentStep) {
      setCurrentStep(n);
      setChecked(false);
    }
  };

  const handleContinue = () => {
    if (!checked) return;
    const next = Math.min(currentStep + 1, STEPS.length);
    setCurrentStep(next);
    setChecked(false);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setChecked(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        /* noop */
      }
    }
  };

  const HeroIcon = step.heroIcon;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.topBar}>
          <span>
            {translate({ id: "governance.delegation.heading", message: "Delegate in 4 steps" })}
          </span>
          <span className={styles.topBarTagline}>
            <FaRegSun aria-hidden="true" />
            {translate({
              id: "governance.delegation.tagline",
              message: "You delegate. DReps represent. The community decides.",
            })}
          </span>
        </div>
        <div className={styles.body}>
          <Stepper currentStep={currentStep} onJump={handleJump} onReset={handleReset} />
          <div className={styles.panelCol}>
            <div className={styles.panelContent} key={currentStep}>
              <div className={styles.panelHeader}>
                <div className={styles.panelHeaderText}>
                  <span className={styles.eyebrow}>
                    {translate(
                      { id: "governance.delegation.eyebrow", message: "Step {current} of {total}" },
                      { current: currentStep, total: STEPS.length },
                    )}
                  </span>
                  <h3 className={styles.panelTitle}>{step.title}</h3>
                </div>
                <div className={styles.hero} aria-hidden="true">
                  <div className={styles.heroTile}>
                    <HeroIcon />
                  </div>
                </div>
              </div>
              {step.render()}
            </div>
            {!step.isFinal && (
              <div className={styles.actionBar}>
                <label
                  className={[
                    styles.checkboxToggle,
                    checked && styles.checkboxToggleChecked,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                  <span className={styles.checkboxMark} aria-hidden="true">
                    <FaCheck />
                  </span>
                  <span>{checked ? step.ready : step.checkbox}</span>
                </label>
                <button
                  type="button"
                  className={styles.continueButton}
                  disabled={!checked}
                  onClick={handleContinue}
                >
                  {translate({ id: "governance.delegation.continue", message: "Continue" })}
                  <FaArrowRight size={12} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.footerStrip}>
        <FaShieldAlt aria-hidden="true" />
        <span>
          {translate({
            id: "governance.delegation.footer.text",
            message: "On-chain governance is how Cardano evolves.",
          })}
        </span>
        <Link to="/governance#paths">
          {translate({ id: "governance.delegation.footer.link", message: "Learn more about governance" })}
        </Link>
      </div>
    </div>
  );
}
