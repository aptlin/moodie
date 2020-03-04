import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormikHelpers } from "formik";
import kebabcase from "lodash.kebabcase";
import startCase from "lodash.startcase";
import React, { useState } from "react";
import Link from "next/link";
import { Button, Col, Container, Row } from "reactstrap";
import About from "../../components/About";
import Favorites, { toggleFavorite } from "../Favorites";
import Gallery from "../Gallery";
import Header from "../Header";
import { GalleryContextConsumer } from "../../components/Contexts/GalleryContext";

const Moodie: React.FC<MoodieProps> = ({ experienceName }) => {
  return (
    <Container fluid={true} className="p-4">
      <Header />
      <Row>
        <Col md={{ size: 3 }}>
          <Favorites />
        </Col>
        <Col>
          <GalleryContextConsumer>
            {({ state, dispatch }: GalleryState) => {
              const kebabSearchQuery = kebabcase(experienceName);
              if (state && dispatch && kebabSearchQuery in state) {
                const log = state[kebabSearchQuery];
                if (log) {
                  return (
                    <>
                      <h4 className="row d-flex align-items-center">
                        <Col xs="auto">Current experience:</Col>
                        <Col xs="auto">
                          <Link href={`/${experienceName}`}>
                            <span>{startCase(log.title)}</span>
                          </Link>
                        </Col>
                        <Col xs="auto" className="mr-auto pb-2 pt-2">
                          {log.isFavorite ? (
                            <Button
                              color="danger"
                              onClick={() =>
                                toggleFavorite(
                                  experienceName,
                                  log,
                                  state,
                                  dispatch
                                )
                              }
                            >
                              Remove from favorites
                            </Button>
                          ) : (
                            <Button
                              color="warning"
                              onClick={() =>
                                toggleFavorite(
                                  experienceName,
                                  log,
                                  state,
                                  dispatch
                                )
                              }
                            >
                              Add to favorites
                            </Button>
                          )}
                        </Col>
                      </h4>
                      <Gallery archive={state} />
                    </>
                  );
                } else {
                  dispatch({
                    type: "fetch",
                    data: { searchQuery: experienceName }
                  });
                }
              } else {
                return <About />;
              }
            }}
          </GalleryContextConsumer>
        </Col>
      </Row>
    </Container>
  );
};

export default Moodie;
