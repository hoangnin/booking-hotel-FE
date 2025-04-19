import {
  IconCalendarStats,
  IconGauge,
  IconNotes,
  IconUsers,
} from "@tabler/icons-react";
import { ScrollArea } from "@mantine/core";
import { LinksGroup } from "./NavbarLinksGroup";
import { useSelector } from "react-redux";
// import { Logo } from "./Logo";
import classes from "./ProfileNavbar.module.css";

const mockdata = [
  // { label: "Dashboard", icon: IconGauge },
  // {
  //   label: "Market news",
  //   icon: IconNotes,
  //   initiallyOpened: true,
  //   links: [
  //     { label: "Overview", link: "/" },
  //     { label: "Forecasts", link: "/" },
  //     { label: "Outlook", link: "/" },
  //     { label: "Real time", link: "/" },
  //   ],
  // },
  // {
  //   label: "Releases",
  //   icon: IconCalendarStats,
  //   links: [
  //     { label: "Upcoming releases", link: "/" },
  //     { label: "Previous releases", link: "/" },
  //     { label: "Releases schedule", link: "/" },
  //   ],
  // },
  // { label: "Analytics", icon: IconPresentationAnalytics },
  // { label: "Contracts", icon: IconFileAnalytics },
  // { label: "Settings", icon: IconAdjustments },
  // {
  //   label: "Security",
  //   icon: IconLock,
  //   links: [
  //     { label: "Enable 2FA", link: "/" },
  //     { label: "Change password", link: "/" },
  //     { label: "Recovery codes", link: "/" },
  //   ],
  // },
  { label: "Information", icon: IconNotes, link: "/profile" }, // default
  {
    label: "Booking history",
    icon: IconCalendarStats,
    link: "/profile/orderHistory",
  },
  { label: "Dashboard", icon: IconGauge, link: "/profile/dashboard" },
  {
    label: "User Management",
    icon: IconUsers,
    link: "/profile/userManagement",
  },
];

export function NavbarNested() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const roles = userInfo?.roles || [];

  console.log("User Info:", userInfo);
  console.log("Roles:", roles);

  const links = mockdata.map((item) => {
    // Hide Dashboard and User Management for non-admin users
    if (
      (item.label === "Dashboard" || item.label === "User Management") &&
      !roles.some((role) => role.name === "ROLE_ADMIN")
    ) {
      console.log(`${item.label} hidden - User is not admin`);
      return null;
    }
    // Show all other menu items
    return <LinksGroup {...item} key={item.label} />;
  });

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}></div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      {/* <div className={classes.footer}>
        <UserButton />
      </div> */}
    </nav>
  );
}
