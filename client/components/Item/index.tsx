import React from "react";
import { Card, CardImg, Spinner } from "reactstrap";

const Item: React.FC<ItemProps> = ({ experience }) => {
  const [isLoaded, updateStatus] = React.useState(false);
  return (
    <Card
      style={{
        background: "#e5e5e5"
      }}
    >
      <div
        className="item-placeholder"
        style={
          isLoaded
            ? { display: "none" }
            : {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: `${experience.height}px`,
                minWidth: `${experience.width}px`
              }
        }
      >
        <Spinner animation="border" role="status" />
      </div>
      <CardImg
        src={experience.url}
        onLoad={() => updateStatus(true)}
        style={isLoaded ? {} : { display: "none" }}
      />
    </Card>
  );
};
export default Item;
