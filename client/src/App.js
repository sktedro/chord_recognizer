import './App.css';
import { useState } from "react";
import React from 'react';
import { Line } from 'react-chartjs-2';


const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      // label: "First dataset",
      data: [33, 53, 85, 41, 44, 65],
      // fill: true,
      // backgroundColor: "rgba(75,192,192,0.2)",
      // borderColor: "rgba(75,192,192,1)"
    }
  ]
};

function App() {

  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };

  const handleSubmission = () => {
    const formData = new FormData();

    formData.append('file', selectedFile);

    fetch(
      'http://localhost:5000/api/upload',
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log('Success:', result.message);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="App">
      <input type="file" name="file" onChange={changeHandler} />
        {isSelected ? (
          <div>
            <p>Filename: {selectedFile.name}</p>
            <p>Filetype: {selectedFile.type}</p>
            <p>Size in bytes: {selectedFile.size}</p>
            <p>
              lastModifiedDate:{' '}
              {selectedFile.lastModifiedDate.toLocaleDateString()}
            </p>
            <div>
              <button onClick={handleSubmission}>Submit a WAV file</button>
            </div>
          </div>
        ) : (
          <p>Select a file to show details</p>
        )}
        {/* <Line data={data} /> */}
    </div>
  );
}

export default App;
