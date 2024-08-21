import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditImportantInformation = ({ match }) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const { infoid } = useParams();
  useEffect(() => {
    // Fetch the data based on the ID in the route params
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/info/${infoid}`
        );
        const { title, subtitle, description } = response.data;
        console.log(response); // Assuming the API response is an object with these fields
        setTitle(title);
        setSubtitle(subtitle);
        setDescription(description);
      } catch (error) {
        console.error("Error fetching information:", error);
      }
    };

    fetchData();
  }); // Run the effect whenever the ID in the route params changes

  const handleEdit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/updateImportantInformation`,
        {
          title,
          subtitle,
          description,
        }
      );
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error updating information:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/deleteImportantInformation`
      );
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error deleting information:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Important Information</h1>

      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-600"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="subtitle"
          className="block text-sm font-medium text-gray-600"
        >
          Subtitle
        </label>
        <input
          type="text"
          id="subtitle"
          name="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-600"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        ></textarea>
      </div>

      <button
        onClick={handleEdit}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Edit Information
      </button>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        Delete Information
      </button>
    </div>
  );
};

export default EditImportantInformation;
