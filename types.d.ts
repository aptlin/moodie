interface MoodieImage {
  url: string;
}
interface User {
  id: string;
  name?: string;
  bio?: string;
  email?: string;
  profilePicture?: MoodieImage;
  isEmailVerified?: boolean;
}

interface UserState {
  user?: User;
  isLoggedIn: boolean;
}
type AuthDispatch = (action: AuthAction | UserAction) => void | Promise<void>;

interface AuthState {
  state?: UserState;
  dispatch?: AuthDispatch;
}

interface AuthAction {
  type: "fetch";
}
interface UserAction {
  type: "set" | "clear";
  data: UserState;
}

interface ArchiveState {
  [experience: string]: ExperienceLog;
}

type ArchiveDispatch = (
  action: GalleryAction | ArchiveAction
) => void | Promise<void>;

interface GalleryState {
  state?: ArchiveState;
  dispatch?: ArchiveDispatch;
}

type ArchiveActionType = "update" | "delete" | "clear";

interface ArchiveAction {
  type: ArchiveActionType;
  data: ArchiveState;
}

interface GalleryAction {
  type: "fetch" | ArchiveActionType;
  data: SearchRequest;
}

type GalleryDispatch = (
  action: GalleryAction | ArchiveAction
) => void | Promise<void>;

interface SearchRequest {
  searchQuery: string;
}

type Experience = {
  url: string;
  title: string;
  height: number;
  width: number;
};

type ExperienceLog = {
  title: string;
  experiences: Experience[];
  isFavorite: boolean;
};

type SearchSubmission = (value: SearchRequest) => void;

type UpdateArchive = React.Dispatch<React.SetStateAction<ArchiveState>>;

interface GalleryProps {
  archive: ArchiveState;
}

interface ItemProps {
  experience: Experience;
}

interface LikeProps {
  on?: boolean;
  onClick?: (event: MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

interface MoodieProps {
  experienceName: string;
}
