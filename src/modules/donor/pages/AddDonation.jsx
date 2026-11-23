
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Utensils } from 'lucide-react';
import { useAuth } from '../../authentication/useAuth';
import { supabase } from '../../../services/supabaseClient';
import { getCoordinates } from '../../ngo/services/geocodingService';
import './AddDonation.css';

function AddDonation() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    food_name: '',
    category: '',
    description: '',
    quantity: '',
    quantity_unit: 'servings',
    pickup_location: '',
    packaging_status: 'not_packed',
  });

  const [foodImage, setFoodImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;

    setError('');
    setSuccess('');

    if (!user?.id) {
      setError('Please log in before submitting a donation.');
      return;
    }

    if (!formData.pickup_location.trim()) {
      setError('Please enter a pickup location.');
      return;
    }

    if (Number(formData.quantity) <= 0) {
      setError('Quantity must be greater than zero.');
      return;
    }

    // Validate food image
    if (foodImage) {
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
      ];

      if (!allowedTypes.includes(foodImage.type)) {
        setError('Only JPG, PNG and WEBP images are allowed.');
        return;
      }

      if (foodImage.size > 5 * 1024 * 1024) {
        setError('Image size must not exceed 5 MB.');
        return;
      }
    }

    setSubmitting(true);

    let uploadedImagePath = null;

    try {
      // 1. Convert pickup address into coordinates
      const coordinates = await getCoordinates(
        formData.pickup_location
      );

      if (!coordinates) {
        throw new Error(
          'Location not found. Please enter a more complete pickup address, including city and state.'
        );
      }

      // 2. Upload food image to Supabase Storage
      let imageUrl = null;

      if (foodImage) {
        const fileExtension = foodImage.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExtension}`;
        const filePath = `${user.id}/${fileName}`;

        const { data: uploadData, error: uploadError } =
          await supabase.storage
            .from('food-images')
            .upload(filePath, foodImage, {
              contentType: foodImage.type,
              upsert: false,
            });

        if (uploadError) {
          throw uploadError;
        }

        uploadedImagePath = uploadData.path;

        // Get public image URL
        const { data: publicUrlData } = supabase.storage
          .from('food-images')
          .getPublicUrl(uploadData.path);

        imageUrl = publicUrlData.publicUrl;
      }

      // 3. Save donation and coordinates in Supabase
      const { error: insertError } = await supabase
        .from('food_donations')
        .insert({
          donor_id: user.id,
          food_name: formData.food_name.trim(),
          category: formData.category,
          description: formData.description.trim() || null,
          quantity: Number(formData.quantity),
          quantity_unit: formData.quantity_unit,
          food_image_url: imageUrl,
          pickup_location: formData.pickup_location.trim(),
          packaging_status: formData.packaging_status,

          // Map coordinates
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        });

      if (insertError) {
        throw insertError;
      }

      // 4. Reset form
      setFormData({
        food_name: '',
        category: '',
        description: '',
        quantity: '',
        quantity_unit: 'servings',
        pickup_location: '',
        packaging_status: 'not_packed',
      });

      setFoodImage(null);
      formElement.reset();

      setSuccess(
        'Food donation submitted successfully! Its location has been saved.'
      );

    } catch (err) {
      console.error('Donation submission error:', err);

      // Remove uploaded image if database insertion fails
      if (uploadedImagePath) {
        const { error: cleanupError } = await supabase.storage
          .from('food-images')
          .remove([uploadedImagePath]);

        if (cleanupError) {
          console.error('Image cleanup error:', cleanupError);
        }
      }

      setError(
        err.message || 'Unable to submit donation. Please try again.'
      );

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="donation-page">

      <div className="donation-header">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate('/donor-dashboard')}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <h1>Add Food Donation</h1>
        <p>Share surplus food with people who need it.</p>
      </div>

      <form className="donation-form" onSubmit={handleSubmit}>

        <div className="form-section-title">
          <Utensils size={21} />
          <h2>Food Information</h2>
        </div>

        <label>
          Food Name *
          <input
            type="text"
            name="food_name"
            value={formData.food_name}
            onChange={handleChange}
            placeholder="e.g. Vegetable Rice"
            required
          />
        </label>

        <label>
          Food Category *
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="cooked_meals">Cooked Meals</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="bakery">Bakery Items</option>
            <option value="dairy">Dairy Products</option>
            <option value="packaged_food">Packaged Food</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the food, preparation time, ingredients, etc."
            rows="4"
          />
        </label>

        <div className="form-row">

          <label>
            Quantity *
            <input
              type="number"
              name="quantity"
              min="0.01"
              step="0.01"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g. 20"
              required
            />
          </label>

          <label>
            Quantity Unit *
            <select
              name="quantity_unit"
              value={formData.quantity_unit}
              onChange={handleChange}
              required
            >
              <option value="servings">Servings</option>
              <option value="kg">Kilograms</option>
              <option value="grams">Grams</option>
              <option value="packets">Packets</option>
              <option value="litres">Litres</option>
            </select>
          </label>

        </div>

        <label>
          Food Image
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) =>
              setFoodImage(e.target.files?.[0] || null)
            }
          />
          <small>
            Accepted formats: JPG, PNG, WEBP. Maximum size: 5 MB.
          </small>
        </label>

        <label>
          Pickup Location *
          <textarea
            name="pickup_location"
            value={formData.pickup_location}
            onChange={handleChange}
            placeholder="Enter complete address, city and state"
            rows="3"
            required
          />
          <small>
            Enter a complete address so your donation can appear on the map.
          </small>
        </label>

        <label>
          Packaging Status *
          <select
            name="packaging_status"
            value={formData.packaging_status}
            onChange={handleChange}
            required
          >
            <option value="not_packed">Not Packed</option>
            <option value="partially_packed">Partially Packed</option>
            <option value="packed">Packed</option>
          </select>
        </label>

        {error && (
          <p className="form-error">{error}</p>
        )}

        {success && (
          <p className="form-success">{success}</p>
        )}

        <button
          type="submit"
          className="submit-donation"
          disabled={submitting}
        >
          {submitting ? 'Finding Location & Submitting...' : 'Submit Donation'}
        </button>

      </form>
    </div>
  );
}

export default AddDonation;