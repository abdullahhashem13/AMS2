// @ts-ignore
import { AiFillHome } from "react-icons/ai";
// @ts-ignore
import { MdOutlineSettingsInputComposite } from "react-icons/md";
// @ts-ignore
import { IoMdSettings } from "react-icons/io";
// @ts-ignore
import { IoMdNotifications } from "react-icons/io";
// @ts-ignore
import { SlLogout } from "react-icons/sl";

export const Saidbardata = [
  {
    title: "لوحة التحكم",
    icon: <MdOutlineSettingsInputComposite />,
    link: "/Dashboardfully/Dashboard",
  },
  {
    title: "الرئيسية",
    icon: <AiFillHome />,
    link: "/home",
  },
  {
    title: "الإشعارات",
    icon: <IoMdNotifications />,
    link: "/Notfigation",
  },
  {
    title: "الأعدادات",
    icon: <IoMdSettings />,
    link: "/Setting",
  },
  {
    title: "تسجيل الخروج",
    icon: <SlLogout />,
    link: "/",
  },
];
