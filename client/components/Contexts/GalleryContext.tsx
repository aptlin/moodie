import axios from "axios";
import React, { createContext, Reducer, useEffect, useReducer } from "react";
import kebabcase from "lodash.kebabcase";
import { useRouter } from "next/router";
const GalleryContext = createContext<GalleryState>({
  state: {},
  dispatch: () => {}
});

const reducer: Reducer<ArchiveState, ArchiveAction> = (state, action) => {
  switch (action.type) {
    case "update":
      return action.data;
    case "clear":
      return {};
    default:
      throw new Error();
  }
};

const GalleryContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {});
  const dispatchProxy: GalleryDispatch = action => {
    switch (action.type) {
      case "fetch":
        const { searchQuery } = action.data;
        const searchURL =
          `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=` +
          encodeURIComponent(searchQuery);
        const kebabSearchQuery = kebabcase(searchQuery);
        if (kebabSearchQuery.length > 0) {
          return axios.get(searchURL).then(results => {
            const entry: ArchiveState = {};
            entry[kebabSearchQuery] = {
              title: searchQuery,
              experiences: [],
              isFavorite: false
            };
            for (const result of results.data.data) {
              entry[kebabSearchQuery].experiences.push({
                url: result.images.fixed_width.url,
                height: result.images.fixed_width.height,
                width: result.images.fixed_width.width,
                title: result.title
              });
            }
            return dispatch({
              type: "update",
              data: {
                ...state,
                ...entry
              }
            });
          });
        }
      default:
        return dispatch(action as ArchiveAction);
    }
  };
  const router = useRouter();
  const { searchQuery } = router.query;
  useEffect(() => {
    if (searchQuery && searchQuery.length > 0) {
      const action: GalleryAction = {
        type: "fetch",
        data: { searchQuery: searchQuery as string }
      };
      dispatchProxy(action);
    }
  }, [searchQuery]);
  return (
    <GalleryContext.Provider value={{ state, dispatch: dispatchProxy }}>
      {children}
    </GalleryContext.Provider>
  );
};

const GalleryContextConsumer = GalleryContext.Consumer;

export { GalleryContext, GalleryContextProvider, GalleryContextConsumer };
