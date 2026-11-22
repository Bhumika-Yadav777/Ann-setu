
import { Link } from "react-router-dom";

function DonationCard({ donation }) {
  return (
    <article className="donation-card">

      {donation.food_image_url ? (
        <img
          src={donation.food_image_url}
          alt={donation.food_name}
          className="donation-image"
        />
      ) : (
        <div className="donation-image-placeholder">
          No Image
        </div>
      )}

      <div className="donation-card-content">

        <h3>{donation.food_name}</h3>

        <p>Category: {donation.category}</p>

        <p>
          Quantity: {donation.quantity}{" "}
          {donation.quantity_unit}
        </p>

        <p>
          Pickup: {donation.pickup_location}
        </p>

        <Link to={`/ngo/donations/${donation.id}`}>
          View Details
        </Link>

      </div>
    </article>
  );
}

export default DonationCard;
