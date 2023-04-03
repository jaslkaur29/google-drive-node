import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table'
import axios from 'axios';

const ShowFileDetails = ({file}) => {

    const DownloadFile = async ({file}) => {     
        console.log(file.name);
        console.log(file);
        await fetch("/getFile/"+file.id, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify(file),

          });
    }

    return(
        <div>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Owners</th>
          <th>Click the button to download the file</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{file.name}</td>
          <td>{file.owners.map((o) => o.displayName)}</td>
          <td><button onClick={()=>DownloadFile({file})}>Download</button></td>
        </tr>
      </tbody>
    </Table>
    </div>

    );
}

export default ShowFileDetails;