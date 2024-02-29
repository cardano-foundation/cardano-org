import React from "react";
import styles from "./styles.module.css";

//
// This component:
// gives you the ability to add additional spacing between components
// if no size is specified the default 'small' is eqaual to <br /><br />

const SpacerBox = ({ size }) => {
  // Determine the class based on the size prop
  const spacerClass = styles[size] || styles.small; // we default to 'small' 
  return <div className={spacerClass}></div>;
};

export default SpacerBox;
