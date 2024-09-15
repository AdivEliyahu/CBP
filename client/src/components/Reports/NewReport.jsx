import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import {MyContext} from '../../MyContext';

const NewReport = () => {
    const [location, setLocation] = useState('');
    const [data, setData] = useState('');
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');
    const {user, setUser} = useContext(MyContext);
    const nav = useNavigate();
    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };

    const handleDataChange = (e) => {
        setData(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
        if (file && validImageTypes.includes(file.type)) {
            setImage(file);
        } else {
            alert('Invalid file type. Please select an image.');
            e.target.value = null; 
        }
    };
  
  const onReturnClick = () => {
    nav("/home");
  }
  const containerStyle = {
    maxWidth: '400px',
    margin: 'auto'
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");

        const formData = new FormData();
        formData.append('image', image);

        try {
            const imgFetch = await fetch(`https://api.imgbb.com/1/upload?key=fde587d2e8b98ad1d909c354927dda4d`, {
                method: 'POST',
                body: formData,
            });

            const imgJson = await imgFetch.json();
            const imageUrl = imgJson? imgJson?.data?.url : "";
            setUrl(imageUrl);

            const reportResponse = await fetch('/report/new', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    "id": user.id,
                    "data": data,
                    "location": location,
                    "image": imageUrl
                })
            });

            const reportData = await reportResponse.json();
            console.log('Report created:', reportData);
            nav('/reports');
        } catch (e) {
            console.error('Error:', e);
            alert("Couldn't upload image or create report");
        }
    };

    return (
      <div class="px-4 py-5 my-5 text-center">
        <div className="display-5 mb-5 fw-bold text-body-emphasis">
            New Report
        </div>
        <form onSubmit={handleSubmit} style={containerStyle}>
            <div className="form-floating my-3">
                <input 
                type="text" 
                value={location} 
                onChange={handleLocationChange} 
                required
                className="form-control"
                placeholder="Location"
                />
                <label htmlFor="floatingInput">Location</label>
            </div>

            <div className="form-floating my-3"> 
                <textarea 
                type="text" 
                value={data} 
                onChange={handleDataChange} 
                required
                className="form-control"
                placeholder="Description"
                />
                <label htmlFor="floatingInput">Description</label>
            </div>

            <div class="input-group mb-3">
                <label class="input-group-text" for="inputGroupFile01">Upload:</label>
                <input type="file" class="form-control" onChange={handleImageChange}/>
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-3">
                Create new report
            </button>
        </form>

    </div>
    );
};

export default NewReport;