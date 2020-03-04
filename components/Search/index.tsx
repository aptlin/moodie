import { Field, Form, Formik, FormikHelpers } from "formik";
import React from "react";
import {
  Button,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import * as Yup from "yup";
import { GalleryContextConsumer } from "../Contexts/GalleryContext";
import { useRouter } from "next/router";
import kebabCase from "lodash.kebabcase";

const searchQueryWarning = "Please search for a meaningful experience.";
const searchValidationSchema = Yup.object().shape({
  searchQuery: Yup.string()
    .min(1, searchQueryWarning)
    .required(searchQueryWarning)
});

const SearchInput: React.FC<any> = ({
  field,
  form: { touched, errors, ...rest },
  ...props
}) => (
  <FormGroup>
    <InputGroup>
      <Input
        {...props}
        {...field}
        invalid={Boolean(touched[field.name] && errors[field.name])}
      />

      <InputGroupAddon addonType="append">
        <Button color="info">Search</Button>
      </InputGroupAddon>
      {touched["searchQuery"] && errors["searchQuery"] ? (
        <FormFeedback tooltip>{errors["searchQuery"]}</FormFeedback>
      ) : null}
    </InputGroup>
  </FormGroup>
);

const Search: React.FC = () => {
  const router = useRouter();
  return (
    <GalleryContextConsumer>
      {({ state, dispatch }: GalleryState) => {
        const onSubmit = (
          request: SearchRequest,
          helpers: FormikHelpers<SearchRequest>
        ) => {
          if (state && dispatch) {
            dispatch({ type: "fetch", data: request });
            router.push(`/${kebabCase(request.searchQuery)}`);
          }
        };
        return (
          <Formik
            initialValues={{
              searchQuery: ""
            }}
            validationSchema={searchValidationSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form>
                <Field
                  name="searchQuery"
                  placeholder="What do you want to experience?"
                  component={SearchInput}
                  style={{ width: "20rem" }}
                />
              </Form>
            )}
          </Formik>
        );
      }}
    </GalleryContextConsumer>
  );
};
export default Search;
