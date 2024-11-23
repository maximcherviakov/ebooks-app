import ErrorPage from "./ErrorPage";

const ServerError: React.FC = () => (
  <ErrorPage
    code={500}
    title="Internal Server Error"
    description="Something went wrong on our end. Please try again later."
  />
);

export default ServerError;
