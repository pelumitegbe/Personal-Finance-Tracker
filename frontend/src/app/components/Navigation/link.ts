import { FaPiggyBank } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineAccountCircle, MdOutlineCategory } from "react-icons/md";
import { GrPieChart } from "react-icons/gr";


export const adminLinks = [
  {
    route: "/dashboard",
    name: "Dashboard",
    Icon: RxDashboard,
    allowed: ["user", "admin"],
  },
  {
    route: "/transactions",
    name: "Transactions",
    Icon: FaPiggyBank,
    allowed: ["user", "admin"],
  },
  {
    route: "/budget",
    name: "Budget",
    Icon: GrPieChart,
    allowed: ["user", "admin"],
  },
  {
    route: "/category",
    name: "Categories",
    Icon: MdOutlineCategory,
    allowed: ["admin"],
  },
  {
    route: "/account",
    name: "Account",
    Icon: MdOutlineAccountCircle,
    allowed: ["user", "admin"],
  },
];
