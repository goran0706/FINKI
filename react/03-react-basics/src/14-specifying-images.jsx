import { useState } from "react";
import image1 from "../assets/example1.png";
import image2 from "../assets/example2.png";
import image3 from "../assets/example3.png";
import image4 from "../assets/example4.png";

// dynamically load multiple images using an object mapping
const imageMap = {
  image1,
  image2,
  image3,
  image4,
};

const SpecifyingImages = () => {
  // data
  const [image, setImage] = useState("image1");

  // logic
  const randomizeImage = () => "image" + Math.floor(Math.random() * 5);
  const handleClick = () => setImage(randomizeImage());

  // view
  return (
    <div>
      <h1>Specifying Images</h1>
      <img src={imageMap[image]} alt="random" width={100} height={100} />
      <button onClick={handleClick}>Load new image</button>
    </div>
  );
};

export default SpecifyingImages;
