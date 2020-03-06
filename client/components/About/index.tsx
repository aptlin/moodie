import React from "react";
import {
  Card,
  CardBody,
  CardDeck,
  CardImg,
  CardText,
  Container
} from "reactstrap";

const About = () => {
  return (
    <Container>
      <CardDeck>
        <Card body className="text-center col-md-4 mx-auto">
          <CardBody>
            <CardText>
              Moodie helps you feel better by finding gifs that match your
              emotions.
            </CardText>
          </CardBody>
          <CardImg
            height={"200"}
            style={{ objectFit: "contain" }}
            src="https://source.unsplash.com/random/200×200/?optimism"
          />
        </Card>
        <Card body className="text-center col-md-4 mx-auto">
          <CardBody>
            <CardText>Save favorites and enjoy! </CardText>
          </CardBody>
          <CardImg
            height={"200"}
            style={{ objectFit: "contain" }}
            src="https://source.unsplash.com/random/200×200/?joy"
          />
        </Card>
        <Card body className="text-center col-md-4 mx-auto">
          <CardBody>
            <CardText>
              Start exploring experiences in the search bar above.
            </CardText>
          </CardBody>
          <CardImg
            height={"200"}
            src="https://source.unsplash.com/random/200×200/?adventure"
            style={{ objectFit: "contain" }}
          />
        </Card>
      </CardDeck>
    </Container>
  );
};
export default About;
