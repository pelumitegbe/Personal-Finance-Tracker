import React from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import {DashboardCardProps} from "../../interface"

const DashboardCard: React.FC<DashboardCardProps> = ({ Icon, title, count, url = "", color, colorInner }) => {
  return (
    <Link className={styles.card} href={url}>
      <div className={styles.text}>
        <p>{title}</p>
        <h1> {count}</h1>
      </div>
      <div className={`${styles.circle} ${styles[colorInner]}`}>
        <div className={`${styles.icircle} ${styles[color]}`}>{<Icon />}</div>
      </div>
    </Link>
  );
};

export default DashboardCard;
