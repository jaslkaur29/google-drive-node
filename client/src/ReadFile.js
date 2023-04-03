import React, {useState, useEffect} from 'react';
import axios from 'axios';
import ShowFileDetails from './ShowFileDetails'

const ReadFile = () => {

    const [list, setList] = useState([]);
    const [waitMsg, setWaitMsg] = useState();


    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.get("/getFiles")
            .then((response) => {
                console.log(response.data);
                setList(response.data);
            });
        } catch (err) {
          console.log(err);
        }

      };

    return(
    <div>
        <form id = "listFiles">
        <h4 className = "FilesArea">Click on the button below to display the current files</h4>
        <button type="submit" onClick={handleClick}>Display All Files</button>
        <p>{waitMsg}</p>
        {list.map((l, index) => (
            <div key = {index}>
                <ShowFileDetails file = {l}></ShowFileDetails>
            </div>
        ))}
        </form>
    </div>
    );

}

export default ReadFile;