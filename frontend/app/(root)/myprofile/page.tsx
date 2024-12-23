'use client'
import { AppContext } from '@/app/context/AppContext'
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'


const MyProfile = () => {
  const { toast } = useToast();
  const { userData, setUserData, backendUrl, token, loadUserProfileData } = useContext(AppContext)
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserData({ ...userData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };



  const handleSave = async () => {

    try {
      const formData = new FormData()

      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', userData.address)
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)
      if (userData.image) {
        formData.append('image', userData.image);
      }

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token, // Replace `token` with your actual token variable
        },
      });

      if (data.success) {
        toast({
          title: "Change Successful",
          description: "The user's data has been successfully updated..",
        });
        await loadUserProfileData()
      } else {
        toast({
          title: 'Change Failed',
          description: data.message || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }


    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Unexpected Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return userData && (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <div className="text-center">
          <label htmlFor="profileImage" className="cursor-pointer">
            <img
              src={imagePreview || (typeof userData.image === 'string' ? userData.image : '/guest.png')}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-4 border"
            />
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <h2 className="text-xl font-semibold mb-2">{userData.name || 'Your Name'}</h2>
          <p className="text-gray-600">{userData.email || 'Your Email'}</p>
        </div>

        <form className="mt-4 space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={userData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={userData.dob}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block text-gray-700">Gender</label>
            <select
              name="gender"
              value={userData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-indigo-300"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </form>
        <button
          onClick={handleSave}
          className="w-full bg-indigo-500 text-white py-2 rounded mt-4 hover:bg-indigo-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default MyProfile