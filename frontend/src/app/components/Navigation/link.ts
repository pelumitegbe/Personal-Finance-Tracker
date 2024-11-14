import { FaPiggyBank } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineAccountCircle } from "react-icons/md";


export const adminLinks = [
  {
    route: "/dashboard",
    name: "Dashboard",
    Icon: RxDashboard,
    allowed: ["Super Admin", "User", "Admin"],
  },
  {
    route: "/transactions",
    name: "Transactions",
    Icon: FaPiggyBank,
    allowed: ["Super Admin", "User", "Admin"],
  },
  {
    route: "/account",
    name: "Account",
    Icon: MdOutlineAccountCircle,
    allowed: ["Super Admin", "User", "Admin"],
  },
];
