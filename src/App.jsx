import { useState } from 'react'
import { MdCloudUpload, MdDelete } from 'react-icons/md'
import { storage } from './firebase.config'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Loader from './components/Loader'
import './App.css'

function App() {

  //state management
  const [imageAsset, setImageAsset] = useState(null);
  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadImage = (e) => {
    setIsLoading(true);
        const imageFile = e.target.files[0]; // uploading single image
        // console.log(imageFile);
        const storageRef = ref(storage, `Images/${Date.now()}-${imageFile.name}`)
        const uploadTask = uploadBytesResumable(storageRef, imageFile); //uploadBytesResumable from firebase storage

        //to calculate the size of the uploaded image
        uploadTask.on('state_changed', (snapshot) => {
            const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        }, (error) => {
            console.log(error);
            setFields(true);
            // setMsg(error.message);
            setMsg('Error uploading image : Try again 🙇');
            setAlertStatus("danger");
            //remove alert 
            setTimeout(() => {
                setFields(false);
                setIsLoading(false);
            }, 4000)
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImageAsset(downloadURL);
                setIsLoading(false);
                setFields(true);
                setMsg('Image Uploaded Successfully 😊');
                setAlertStatus('success');
                setTimeout(() => {
                    setFields(false);

                }, 4000);
            });
        });
  };

      //delete image

      const deleteImage = () => {
        setIsLoading(true);
        const deleteRef = ref(storage, imageAsset);
        //using the deleteObject method from firebase storage
        deleteObject(deleteRef).then(() => {
            setImageAsset(null);
            setIsLoading(false);
            setFields(true);
            setMsg('Image deleted Successfully 😊');
            setAlertStatus('success');
            setTimeout(() => {
                setFields(false);

            }, 4000);
        })
    };

  return (
    <div className="App">
      <div className='w-full min-h-screen flex items-center justify-center'>
        <div className='w-[90%] md:w-[25%] border border-gray-300 rounded-lg p-4
            flex flex-col items-center justify-center gap-4'>
          {/* alert message */}
          {
            fields && (
              <p
                className={`w-full p-2 rounded-lg text-center text-lg font-semibold ${alertStatus === "danger" ? 'bg-red-400 text-red-800' : 'bg-emerald-400 text-emerald-800'}`}>
                {msg}
              </p>
            )
          }
          {/* image upload */}
          <div className="group flex justify-center items-center flex-col border-2
                  border-dotted border-gray-300 w-full h-225 md:h-420 cursor-pointer rounded-lg ">
            {/* if loading is tru show loader else show the react fragment */}
            {
              isLoading ? <Loader /> : (
                <>
                  {/* if imageAsset is null do this otherwise do this */}
                  {
                    !imageAsset ? (
                      <>
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                            <MdCloudUpload className="text-gray-500 text-3xl hover:text-gray-700" />
                            <p className="text-gray-500 hover:text-gray-700">
                              Click here to upload
                            </p>
                          </div>
                          <input
                            type="file"
                            name="uploadimage"
                            accept="image/*"
                            onChange={uploadImage}
                            className="w-0 h-0"
                          />
                        </label>
                      </>
                    ) :
                      (
                        <>
                          <div className='relative h-full '>
                            {/* would display if an image is already available */}
                            <img src={imageAsset} alt="uploaded image" className='w-full h-full object-cover' />
                            <button type='button'
                              className='absolute bottom-3 right-3 p-3 rounded-full bg-red-500
                                      text-xl cursor-pointer outline-none
                                      hover:shadow-md duration-500 transition-all ease-in-out'
                              onClick={deleteImage}>
                              <MdDelete className='text-white' />
                            </button>
                          </div>
                        </>
                      )}
                </>
              )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default App
