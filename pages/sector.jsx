import React, { useState, useEffect } from "react";
import axios from "../services/httpServices"
import {
  apiUrl
} from "../config.json"
export default function Sector() {
  const [sectorList, setSectorList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    parentid: "0"
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    axios.get(apiUrl + "/sector").then((response) => {
      if (response.data.appStatus) {
        setSectorList(response.data.appData);
      }
    }).catch(ex => {
      console.log(ex);
    });
  }, []);
  const handleChange = (e) => {
    let formDataCopy = { ...formData };
    formDataCopy[e.currentTarget.name] = e.currentTarget.value;
    setFormData(formDataCopy);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios.post(apiUrl + "/sector", formData).then((response) => {
      if (response.data.appStatus) {
        setSectorList([ ...sectorList,response.data.appData]);
        setFormData({
          ...formData,
          name: "",
        });
        setIsLoading(false);
      }
    }).catch(ex => {
      console.log(ex);
      setIsLoading(false);
    });
  }
  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-12 col-md-12">
          <form onSubmit={handleSubmit}>
            <div className="mb-3 row">
              <label htmlFor="name" className="col-sm-2 col-form-label">
                Name
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                  placeholder="Name"
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="parentid" className="col-sm-2 col-form-label">
                Sectors
              </label>
              <div className="col-sm-10">
                <select className="form-select"
                  id="parentid"
                  name="parentid"
                  onChange={handleChange}
                  value={formData.parentid}>
                  <option key={"k"} value="">select Sector</option>
                  {
                    sectorList.map((item) => {
                      return <option key={item.id} value={item.id}>{item.name}</option>
                    })
                  }
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading && <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
              </>}
              {
                !isLoading && "Save"
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
