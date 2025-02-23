import { useState } from 'react';
import { categories } from '../data';
import { ImCross } from "react-icons/im";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import { ToastContainer } from "react-toastify";
import { IF } from '../url';


export default function Form({ type, work, setWork, handleSubmit, note }) {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWork((prevWork) => {
      return {
        ...prevWork,
        [name]: value,
      };
    });
  };

  const handleUploadPhotos = (e)=> {
    const newPhotos = e.target.files;
    setWork((prevWork) => {
      return {
        ...prevWork,
        photos: [...prevWork.photos, ...newPhotos],
      };
    });
  }

  const handleRemovePhoto = (indexToRemove)=> {
    setWork((prevWork) => {
      return {
        ...prevWork,
        photos: prevWork.photos.filter((_, index) => index !== indexToRemove),
      };
    });
  }

  return (
    <div className="bg-gray-200 p-[40px_60px_120px]">
      <p className="mb-8 text-blue-900 font-bold text-3xl">{type} Your Work</p>
      <form className="p-[30px_40px] rounded-3xl bg-white">
        <p className="text-xl font-semibold text-blue-900">Which of these categories best describes your work?</p>
        <div className='m-[20px_0px_40px] flex flex-wrap gap-10'>
          {categories?.map((item, index)=> (
            <p
            className={`${work.category === item ? "text-lg font-semibold cursor-pointer text-pink-700" : "text-lg font-semibold cursor-pointer"}`}
            key={index}
            onClick={() => {
                setWork({ ...work, category: item });
              }}
            >{item}</p>
          ))
          }
        </div>
        <p className='text-xl font-semibold text-blue-900'>Add some photos of your work</p>
        {work.photos.length < 1 && (
          <div className="flex flex-wrap gap-4 m-[20px_0px_40px]">
            <input
              id="image"
              type="file"
              className='hidden'
              accept="image/*"
              onChange={handleUploadPhotos}
              multiple
            />
            <label htmlFor="image" className="p-[30px_40px] md:p-[40px_100px] rounded-xl flex flex-col justify-center items-center
            cursor-pointer border border-dashed border-gray-400">
              <div className="text-6xl">
                <IoIosImages />
              </div>
              <p className='text-center font-semibold'>Upload from your device</p>
            </label>
          </div>
           )}

        {work.photos.length > 0 && (
          <div className="flex flex-wrap gap-4 m-[20px_0px_40px]">
            {work?.photos?.map((photo, index) => (
              <div key={index} className="relative w-[250px] h-[150px] cursor-move">
                {photo instanceof Object ? (
                  <img className='w-full h-full' src={URL.createObjectURL(photo)} alt="work" />
                ) : (
                  <img className='w-full h-full' src={IF+photo} alt="work" />
                )}
                <button type="button" 
                className='absolute right-0 top-0 p-[3px] bg-[#ffffffcc] text-xl hover:text-pink-700'
                onClick={() => handleRemovePhoto(index)}>
                  <BiTrash />
                </button>
              </div>
            ))}
            <input
              id="image"
              type="file"
              className='hidden'
              accept="image/*"
              onChange={handleUploadPhotos}
              multiple
            />
            <label htmlFor="image" className="w-[250px] h-[150px] flex flex-col justify-center items-center
            cursor-pointer border border-dashed border-gray-400">
              <div className="text-6xl">
                <IoIosImages />
              </div>
              <p>Upload from your device</p>
            </label>
          </div>
        )}

        <p className='mb-2 mt-2 text-red-500 text-center'>{note}</p>

        <p className="text-xl font-semibold text-blue-900">What make&apos;s your Work attractive?</p>
        <div>
         <p className='p-[20px_0px_10px] font-bold'>Title</p>
         <input
            className='border border-solid border-gray-300 rounded-xl outline-none w-full font-semibold p-[15px_30px]'
            type="text"
            placeholder="Title"
            value={work.title}
            onChange={handleChange}
            name="title"
          />
          <p className="p-[20px_0px_10px] font-bold">Description</p>
          <textarea
            className='border border-solid border-gray-300 rounded-xl p-[15px_30px]
            outline-none sm:w-[280px] md:w-[600px] font-medium'
            type="text"
            placeholder="Description"
            value={work.description}
            onChange={handleChange}
            name="description"
          />
          <p className='p-[20px_0px_10px] font-bold'>Now, set your PRICE</p>
          <span className='text-2xl mr-5 font-semibold'>₹</span>
          <input
            type="number"
            placeholder="Price"
            onChange={handleChange}
            value={work.price}
            name="price"
            className="w-[160px] md:w-[200px] border border-solid border-gray-300 rounded-xl outline-none font-semibold p-[15px_30px]"
          />
        </div>
        <button onClick={handleSubmit} className="mt-10 p-3 bg-blue-900 text-white 
        rounded-md hover:bg-blue-800" type="submit">PUBLISH YOUR WORK</button>
      </form>
      <ToastContainer />
    </div>
  )
}
