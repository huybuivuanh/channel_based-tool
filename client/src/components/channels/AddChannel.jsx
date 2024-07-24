import React, { useState } from "react";
import "../../styles/Channel.css";
import { useAuth } from "../../authentication/AuthContext";

function AddChannel({ onClose, onSubmit }) {
  const { authState } = useAuth();
  const { user } = authState;
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    setSelectedImage(image);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // destructure formData before sending to the server
    const { name, description } = formData;
    const userID = user.id;
    const userName = user.fName + " " + user.lName;

    const data = new FormData();
    data.append("name", name);
    data.append("image", selectedImage);
    data.append("description", description);
    data.append("userID", userID);
    data.append("userName", userName);
    onSubmit(data);

    setFormData({
      name: "",
      description: "",
    });
    onClose();
  };

  // cancel button. navigate back to home page
  function handleCancel() {
    onClose();
  }

  return (
    <div className="add-channel-form-container">
      <h1 style={{ textAlign: "center" }}>Add Channel</h1>
      <form className="add-channel-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Channel Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <label htmlFor="description">Channel Description</label>
        <textarea
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleImageChange}
        />
        <br></br>
        <br></br>
        <button type="submit">Add Channel</button>
        <button className="cancelButton" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddChannel;
