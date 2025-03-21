import ErrorPage from "./ErrorPage";

const NotFound: React.FC = () => (
  <ErrorPage
    code={404}
    title="Page Not Found"
    description="The page you are looking for does not exist."
  />
);

export default NotFound;
