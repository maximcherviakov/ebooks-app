import { useParams } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();

  return <div>BookDetails for id: {id}</div>;
};

export default BookDetails;
