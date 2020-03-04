import React from "react";

const LikeButton: React.FC<LikeProps> = ({ on, onClick }) => {
  return (
    <div className="mx-2">
      <style jsx>{`
        /* Adapted from https://css-tricks.com/hearts-in-html-and-css/ */

        .heart {
          --heart-size: 12px;
          --heart-margin: calc(var(--heart-size) / 2);
          --color: #ff6060;
          background-color: var(--color);
          display: inline-block;
          height: var(--heart-size);
          margin: 0 var(--heart-margin);
          position: relative;
          top: 0;
          transform: rotate(-45deg);
          width: var(--heart-size);
        }

        .heart:before,
        .heart:after {
          content: "";
          background-color: var(--color);
          border-radius: 50%;
          height: var(--heart-size);
          position: absolute;
          width: var(--heart-size);
        }

        .heart:before {
          top: calc(-1 * var(--heart-margin));
          left: 0;
        }

        .heart:after {
          left: var(--heart-margin);
          top: 0;
        }
      `}</style>
      <span
        className="heart"
        style={{
          filter: on ? "none" : "grayscale(100%) invert(100%) "
        }}
        onClick={onClick}
      ></span>
    </div>
  );
};

export default LikeButton;
