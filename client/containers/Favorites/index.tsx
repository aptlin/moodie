import startCase from "lodash.startcase";
import React from "react";
import Link from "next/link";
import { Jumbotron } from "reactstrap";
import LikeButton from "../../components/Like";
import { GalleryContextConsumer } from "../../components/Contexts/GalleryContext";

export function toggleFavorite(
  experienceName: string,
  log: ExperienceLog,
  state: ArchiveState,
  dispatch: ArchiveDispatch
) {
  const isFavorite = !log.isFavorite;
  log.isFavorite = isFavorite;
  const action: ArchiveAction = {
    type: "update",
    data: {
      ...state,
      ...{ [experienceName]: log }
    }
  };
  dispatch(action);
}

const Favorites: React.FC = () => {
  return (
    <GalleryContextConsumer>
      {({ state, dispatch }: GalleryState) => {
        const favorites = Object.keys(state)
          .filter(key => state[key].isFavorite)
          .reduce((obj: ArchiveState, key: string) => {
            obj[key] = state[key];
            return obj;
          }, {});

        const favoritesList = Object.keys(favorites).map(
          (experienceName, idx) => {
            const log = favorites[experienceName];
            return (
              <h5 className="d-flex">
                <LikeButton
                  on={log.isFavorite}
                  onClick={() => {
                    toggleFavorite(experienceName, log, state, dispatch);
                  }}
                />
                <span>
                  <Link href={`/${experienceName}`}>
                    <span>{startCase(log.title)}</span>
                  </Link>
                </span>
              </h5>
            );
          }
        );
        return (
          <div>
            <style jsx>
              {`
                .badge {
                  display: flex;
                  align-items: center;
                  margin-right: 1rem;
                }
              `}
            </style>
            <Jumbotron>
              <h4 className={"text-nowrap"}>
                Favorites ({Object.keys(favorites).length})
              </h4>
              {favoritesList}
            </Jumbotron>
          </div>
        );
      }}
    </GalleryContextConsumer>
  );
};

export default Favorites;
