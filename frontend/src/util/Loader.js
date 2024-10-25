import { createRef } from "react";
import { useSelector } from "react-redux";

//Loader
import { BounceLoader } from "react-spinners";

// MUI

const LoaderDialogue = () => {
  const ref = createRef();
  const { isLoading } = useSelector((state) => state.isLoading);

  return (
    <>
      {isLoading && (
        <div className="mainLoaderBox">
          <div className="loader"></div>
        </div>
      )}

    </>
  );
};

export default LoaderDialogue;
