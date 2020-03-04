import { NextPage } from "next";
import Moodie from "../../containers/Moodie";
import { useRouter } from "next/router";
import { GalleryContextConsumer } from "../../components/Contexts/GalleryContext";

const SearchPage: NextPage = () => {
  const router = useRouter();
  const { searchQuery } = router.query;
  return <Moodie experienceName={searchQuery as string} />;
};

export default SearchPage;
