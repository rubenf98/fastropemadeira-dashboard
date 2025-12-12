import React, { useEffect } from "react";
import { Link, Outlet } from "react-router";
import Navbar from "./pages/common/Navbar";
import styles from "./Template.module.css";
import { useNavigate } from "react-router";
import { connect } from "react-redux";

function Template(props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.isAuthenticated) {
      // navigate("/");
    }
  }, [props.isAuthenticated]);

  return (
    <div className={styles.container}>
      <section className={styles.content}>
        <div className={styles.header}>
          <h2>Painel de Controlo</h2>
          <Link to="/dashboard">
            <img src={import.meta.env.VITE_API_URL + "/logo.svg"} alt="logo" />
          </Link>
        </div>
        <Outlet />
      </section>
      <Navbar />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps, null)(Template);
