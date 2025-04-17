// components/common/Breadcrumbs.jsx
import { Breadcrumbs, Anchor } from "@mantine/core";
import { useLocation, Link } from "react-router-dom";

export default function CustomBreadcrumbs() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbs = [
    <Anchor component={Link} to="/" key="home">
      Home
    </Anchor>,
    ...pathnames.map((value, index) => {
      const to = "/" + pathnames.slice(0, index + 1).join("/");
      const label = decodeURIComponent(
        value.charAt(0).toUpperCase() + value.slice(1)
      );
      return (
        <Anchor component={Link} to={to} key={to}>
          {label}
        </Anchor>
      );
    }),
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-2">
      <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
    </div>
  );
}
