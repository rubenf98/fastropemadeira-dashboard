import React from "react";
import { Outlet } from "react-router";
import Navbar from "./pages/common/Navbar";
import styles from "./Template.module.css";
function Template() {
  return (
    <div className={styles.container}>
      <Outlet className={styles.content} />
      <Navbar />
    </div>
  );
}

export default Template;
