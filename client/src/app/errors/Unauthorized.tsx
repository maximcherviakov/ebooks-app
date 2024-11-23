import ErrorPage from "./ErrorPage";

const Unauthorized: React.FC = () => (
  <ErrorPage
    code={401}
    title="Unauthorized"
    description="You do not have permission to view this page."
  />
);

export default Unauthorized;
