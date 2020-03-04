import React from "react";
import { Navbar, NavbarBrand } from "reactstrap";
import Link from "next/link";
import Logo from "../../components/Logo";
import Search from "../../components/Search";

const Header: React.FC = () => {
  return (
    <Navbar className="d-flex align-items-center p-0 mb-1">
      <style jsx>
        {`
          .brandname {
            -webkit-user-select: none; /* Safari */
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* IE10+/Edge */
            user-select: none; /* Standard */
            font-size: 2rem;
            padding: 1rem !important;
          }
        `}
      </style>
      <NavbarBrand className="d-flex align-items-center mb-1">
        <Link href="/">
          <span>
            <Logo />
          </span>
        </Link>
        <Link href="/">
          <span className="brandname">Moodie</span>
        </Link>
      </NavbarBrand>
      <Search />
    </Navbar>
  );
};
export default Header;
