import React, {useState, useEffect} from 'react';
import axios from 'axios';

const UploadFile = () => {

    const [file, setFile] = useState("");

    const uploadFile = async (e) => {
        e.preventDefault();
        const formElem = document.getElementById("uploadFile");
        await fetch('/upload', {
            method: 'POST',
            body: new FormData(formElem),
          });
        setFile("File Upload is complete!")
    }

    const ResetState = () => {
        setFile("")
    }

    return(
        <div className="container">
            <h3 style={{backgroundColor: "green", color:"white"}}>Upload any file or multiple files to your google drive</h3>
            <form id = "uploadFile">
                <input onClick={ResetState} type="file" name="Files" required multiple />
                <button type="submit" onClick = {uploadFile}>Upload File To Drive</button>
                <div style={{color: "green"}} >{file}</div>
            </form>
        </div>
    )
}

export default UploadFile;