//

import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import Target from "./Target.jsx";

// ----------------------------------------------

class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError = (error) => ({ error });

  componentDidCatch = () => {
    document.body.dataset.status = "error";
  };

  render = () => (this.state.error ? null : this.props.children);
}

const Ready = ({ children }) => {
  useEffect(() => {
    document.body.dataset.status = "ready";
  }, []);

  return children;
};

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <Ready>
      <Target />
    </Ready>
  </ErrorBoundary>,
);
