import { FaPiggyBank } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineAccountCircle } from "react-icons/md";


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
    route: "/account",
    name: "Account",
    Icon: MdOutlineAccountCircle,
    allowed: ["user", "admin"],
  },
];
