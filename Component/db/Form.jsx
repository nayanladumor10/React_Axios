import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Form() {
  const [state, setState] = useState({ name: "" });
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/data")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const newID = (data.length+1).toString();
    axios
      .post("http://localhost:3000/data", {...state,id:newID})
      .then((response) => {
        setData((prevData) => [...prevData, response.data]);
        setState({ name: "" }); 
      })
      .catch((error) => console.error("Error submitting data:", error));
  }

  function handleDelete(id) {
    axios
      .delete(`http://localhost:3000/data/${id}`)
      .then((response) => {
        console.log(response);
        setData((prevData) => prevData.filter((item) => item.id !== id));
      })
      .catch((error) => console.error("Error deleting data:", error));
  }

  function HandleEdit(id){
    let newvalue = prompt('enter the new value:');
     
    axios
    .put(`http://localhost:3000/data/`+ id,{id,name:newvalue})
    .then((response) => {
      setData((prevData) =>
        prevData.map((item) =>
            item.id === id ? response.data : item
        )
              );
    })
    .catch((error) => console.error("Error submitting data:", error));

  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={state.name}
          placeholder="Enter the name"
          onChange={(e) => setState({ name: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>

      <ul>
        {data.map((el) => (
          <li key={el.id}>{el.name}{" "}
          <button type="button" onClick={() => handleDelete(el.id)}>Delete</button>
          <button onClick={()=>HandleEdit(el.id)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
