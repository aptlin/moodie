import React from "react";
import LogoImage from "./logo.svg";

const Logo = () => {
  return (
    <div>
      <style jsx>{`
        #logo {
          animation: logo-spin infinite 20s linear;
        }

        @keyframes logo-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <img id="logo" src={LogoImage} width="75" alt="Moodie Logo"></img>
    </div>
  );
};

export default Logo;
