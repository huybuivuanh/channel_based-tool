import React, { useState } from "react";
import { useAuth } from "../../authentication/AuthContext";

function AddMessage({ close, onSubmit }) {
  const { authState } = useAuth();
  const { user } = authState;
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState("");

  const handleInputChange = (event) => {
    const { value } = event.target;
    setFormData(value);
  };

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    setSelectedImage(image);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const message = formData;
    const userID = user.id;
    const channelID = localStorage.getItem("channelID");

    // Create a FormData object
    const data = new FormData();
    data.append("message", message);
    data.append("image", selectedImage);
    data.append("userID", userID);
    data.append("channelID", channelID);
    onSubmit(data);
    setFormData("");
    setSelectedImage(null);
    close();
  };

  // cancel button. navigate back to home page
  function handleCancel() {
    close();
  }

  return (
    <div className="add-message-form-container">
      <h1 style={{ textAlign: "center" }}>Add Message</h1>
      <form className="add-message-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Message</label>
        <input
          type="text"
          id="message"
          name="message"
          value={formData.name}
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
        <button type="submit">Add Message</button>
        <button className="cancelButton" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddMessage;
