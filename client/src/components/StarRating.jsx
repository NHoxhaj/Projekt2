
import React, { useState } from 'react';
import { assets } from '../assets/assets'; // Ensure you import the star images correctly

const StarRating = ({ totalStars, numberOfRatings, onRate }) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);

  const averageRating = numberOfRatings ? totalStars / numberOfRatings : 0;

  const handleMouseOver = (star) => setHoveredStar(star);
  const handleMouseOut = () => setHoveredStar(0);
  const handleClick = (star) => {
    setSelectedStar(star);
    onRate(star);
  };

  return (
    <div className="star-rating">
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <img
            key={star}
            src={star <= (hoveredStar || selectedStar || averageRating) ? assets.rating_starts : assets.rating_starts} // Replace with your star icons
            alt={`${star} star`}
            onMouseOver={() => handleMouseOver(star)}
            onMouseOut={handleMouseOut}
            onClick={() => handleClick(star)}
          />
        ))}
      </div>
      <p>{averageRating.toFixed(1)} ({numberOfRatings} ratings)</p>
    </div>
  );
};

export default StarRating;
