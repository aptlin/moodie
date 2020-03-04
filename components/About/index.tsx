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
          <CardImg src="https://source.unsplash.com/random/200×200/?inspiration,surfing" />
        </Card>
        <Card body className="text-center col-md-4 mx-auto">
          <CardBody>
            <CardText>Save favorites and enjoy! </CardText>
          </CardBody>
          <CardImg src="https://source.unsplash.com/random/200×200/?inspiration" />
        </Card>
        <Card body className="text-center col-md-4 mx-auto">
          <CardBody>
            <CardText>
              Start exploring experiences in the search bar above.
            </CardText>
          </CardBody>
          <CardImg src="https://source.unsplash.com/random/200×200/?inspiration,happiness" />
        </Card>
      </CardDeck>
    </Container>
  );
};
export default About;
