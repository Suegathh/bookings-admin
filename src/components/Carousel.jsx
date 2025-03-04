import { useEffect, useState } from "react";
import "./Carousel.scss"

const Carousel = ({ data = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevState) => {
        // Safely handle empty data array
        if (!data.length) return 0;
        
        if (prevState === data.length - 1) {
          return 0;
        } else {
          return prevState + 1;
        }
      });
    }, 3000);

    // Move the cleanup function INSIDE the useEffect
    return () => {
      clearInterval(interval);
    };
  }, [data]); // Add data to dependency array

  // Add a check for empty data
  if (!data || data.length === 0) {
    return <div>No images to display</div>;
  }

  return (
    <div className="carousel-wrapper">
      <img 
        src={data[currentIndex]} 
        alt={`Carousel image ${currentIndex + 1}`} 
      />
    </div>
  );
};

export default Carousel;