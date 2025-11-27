import React from "react";
import { Outlet } from "react-router";
import Navbar from "./pages/common/Navbar";
import styles from "./Template.module.css";
function Template() {
  return (
    <div className={styles.container}>
      <section className={styles.content}>
        <div className={styles.header}>
          <h2>Painel de Controlo</h2>
          <img src="/vite.svg" alt="" />
        </div>
        <Outlet />
      </section>
      <Navbar />
    </div>
  );
}

export default Template;
