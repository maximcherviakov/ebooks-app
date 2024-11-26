import ErrorPage from "./ErrorPage";

const BadRequest: React.FC = () => (
  <ErrorPage
    code={400}
    title="Bad Request"
    description="The request you made is invalid."
  />
);

export default BadRequest;
