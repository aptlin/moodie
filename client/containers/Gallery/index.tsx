import React from "react";
import { CardColumns } from "reactstrap";
import Item from "../../components/Item";

const Gallery: React.FC<GalleryProps> = ({ log }) => {
  const totalImagesNum = log ? log.experiences.length : 0;
  const cards = totalImagesNum
    ? log.experiences.map((experience, idx) => (
        <Item key={idx} experience={experience} />
      ))
    : null;
  return (
    <CardColumns>
      <style jsx>{`
        .gallery-item {
          border: 3px solid white;
          padding: 0px;
          margin: 0px;
          text-align: center;
          vertical-align: bottom;
          height: auto;
        }
      `}</style>
      {cards}
    </CardColumns>
  );
};

export default Gallery;
