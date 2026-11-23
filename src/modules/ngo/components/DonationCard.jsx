
import { useState } from "react";
import { Link } from "react-router-dom";

const categoryLabels = {
  cooked_meals: "Prepared Meals",
  fruits: "Fresh Fruits",
  vegetables: "Fresh Vegetables",
  bakery: "Bakery Items",
  dairy: "Dairy Products",
  packaged_food: "Packaged Foods",
  other: "Other Donations",
};

function DonationCard({ donation }) {
  const [imageError, setImageError] = useState(false);

  const postedDate = donation.created_at
    ? new Date(donation.created_at).toLocaleDateString()
    : "Recently";

  const expiryDate = donation.expiry_date
    ? new Date(donation.expiry_date).toLocaleDateString()
    : null;

  const imageUrl = donation.food_image_url;

  return (
    <article className="donation-card">
      <div className="donation-card-image">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={donation.food_name || "Food donation"}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="donation-image-placeholder">
            <span>🥗</span>
            <strong>Fresh Food, Shared with Care</strong>
            <small>Ann-Setu Community Donation</small>
          </div>
        )}

        <span className="category-badge">
          {categoryLabels[donation.category] || "Food Donation"}
        </span>

        <span className="donation-image-overlay">
          Made to make a difference ♥
        </span>
      </div>

      <div className="donation-card-content">
        <div className="donation-card-topline">
          <span className="donation-card-label">
            COMMUNITY FOOD SHARING
          </span>
          <span className="donation-posted">
            {postedDate}
          </span>
        </div>

        <h3>{donation.food_name || "Food Donation"}</h3>

        {donation.description && (
          <p className="donation-description">
            {donation.description}
          </p>
        )}

        <div className="donation-quantity">
          <span className="quantity-icon">🥗</span>
          <div>
            <strong>
              {donation.quantity} {donation.quantity_unit}
            </strong>
            <small>Available to share</small>
          </div>
        </div>

        <div className="donation-extra-info">
          <p className="donation-location">
            <span>📍</span>
            <span>{donation.pickup_location || "Location not provided"}</span>
          </p>

          {expiryDate && (
            <p className="donation-expiry">
              <span>🗓️</span>
              <span>Best before: {expiryDate}</span>
            </p>
          )}
        </div>

        <Link
          to={`/ngo-dashboard/donations/${donation.id}`}
          className="claim-donation-btn"
        >
          View Donation <span>→</span>
        </Link>
      </div>
    </article>
  );
}

export default DonationCard;
