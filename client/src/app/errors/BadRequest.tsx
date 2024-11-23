import ErrorPage from "./ErrorPage";

const NotFound: React.FC = () => (
  <ErrorPage
    code={400}
    title="Bad Request"
    description="The request you made is invalid."
  />
);

export default NotFound;
