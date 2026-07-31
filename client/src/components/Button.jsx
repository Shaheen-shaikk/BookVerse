import { Link } from "react-router-dom";

function Button({ text, to }) {
  return (
    <Link to={to}>
      <button>{text}</button>
    </Link>
  );
}

export default Button;