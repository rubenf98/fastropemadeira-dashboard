import React from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router";

function Navbar() {
  return (
    <div className={styles.container}>
      {/* <Link to="/dashboard">Início</Link> */}
      <Link to="/tracker">Despesas</Link>
    </div>
  );
}

export default Navbar;
