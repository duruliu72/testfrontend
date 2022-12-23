import React, { useEffect, useState, useContext } from "react";
import Link from 'next/link'
import { AppStore } from "../store/AppStore";
import axios from "../services/httpService"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import {
  apiUrl
} from "../config.json"
export default function Home() {
  const { authUser, user } = useContext(AppStore);
  const [actionType, setActionType] = useState("all");
  const [sectorList, setSectorList] = useState([]);
  const [userSectors, setUserSectors] = useState([]);
  const [childList, setChildList] = useState([]);
  const [sectorBean, setSectorBean] = useState({
    name: "",
    sectorid: "",
    userid: authUser().id,
    isaggreterms: false,
  });
  let findName = (item) => {
    let findItem = sectorList.find((childItem) => {
      return childItem.id == item.sectorid
    });
    return findItem.name
  }
  const [isLoading, setIsLoading] = useState(false);
  const getChildList = (list, pid) => {
    let filterResult = list.filter((item) => {
      if (item.parentid === pid) {
        return true;
      }
      return false;
    });
    filterResult.forEach(element => {
      element.list = getChildList(list, element.id);
    });
    return filterResult;
  }
  useEffect(() => {
    axios.get(apiUrl + "/sector").then((response) => {
      if (response.data.appStatus) {
        setSectorList(response.data.appData);
        let list = getChildList(response.data.appData, 0);
        setChildList(list);
      }
    }).catch(ex => {
      console.log(ex);
    });
    axios.get(apiUrl + "/usersector", {
      headers: {
        'x-auth-token': user
      }
    }).then((response) => {
      if (response.data.appStatus) {
        setUserSectors(response.data.appData);
      }
    }).catch(ex => {
      console.log(ex);
    });
  }, []);
  const handleSelect = (item) => {
    let sectorListMap = sectorList.map((item) => {
      return {
        ...item,
        isAstive: false
      }
    });
    let findItem = sectorListMap.find((childItem) => {
      return childItem.id == item.id
    });
    if (findItem) {
      let findItemIndex = sectorListMap.findIndex((childItem) => {
        return childItem.id == item.id
      });
      sectorListMap[findItemIndex].isAstive = true;
      let list = getChildList(sectorListMap, 0);
      setChildList(list);
      let sectorBeanCopy = { ...sectorBean };
      sectorBeanCopy["sectorid"] = findItem.id;
      console.log("sectorBeanCopy", sectorBeanCopy)
      setSectorBean(sectorBeanCopy);
    }
  }
  const handleDeSelect = () => {
    let sectorListMap = sectorList.map((item) => {
      return {
        ...item,
        isAstive: false
      }
    });
    let list = getChildList(sectorListMap, 0);
    setChildList(list);
  }
  let x = 0
  let getListElement = (childList) => {
    let result = childList.map((item, i) => {
      if (item.list.length > 0) {
        return <li className="has_sub" key={x++}>
          <span>{item.name}</span>
          <ul>
            {
              getListElement(item.list)
            }
          </ul>
        </li>
      }
      return <li style={{
        background: item.isAstive && "#1a8ae5",
        color: item.isAstive && "#ffffff"
      }} key={x++} onClick={() => {
        handleSelect(item);
      }}>
        <span>{item.name}</span>
      </li>
    })
    return result;
  }
  const handleChange = (e) => {
    let sectorBeanCopy = { ...sectorBean };
    sectorBeanCopy[e.currentTarget.name] = e.currentTarget.value;
    setSectorBean(sectorBeanCopy);
  };
  const handleInputCheck = (e) => {
    let sectorBeanCopy = { ...sectorBean };
    sectorBeanCopy[e.currentTarget.name] = e.target.checked;
    setSectorBean(sectorBeanCopy);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios.post(apiUrl + "/usersector", sectorBean, {
      headers: {
        'x-auth-token': user
      }
    }).then((response) => {
      if (response.data.appStatus) {
        handleDeSelect();
        setUserSectors([...userSectors, response.data.appData]);
        setSectorBean({
          ...sectorBean,
          name: "",
          sectorid: "",
          isaggreterms: false,
        });
        setIsLoading(false);
        toast(response.data.appMessage);
      }
    }).catch(ex => {
      console.log(ex);
      setIsLoading(false);
    });
  }
  const handleSubmitForEdit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios.put(apiUrl + "/usersector/" + sectorBean.id, sectorBean, {
      headers: {
        'x-auth-token': user
      }
    }).then((response) => {
      if (response.data.appStatus) {
        let findItem = userSectors.find((item) => {
          return sectorBean.id == item.id
        });
        if (findItem) {
          let findItemIndex = userSectors.findIndex((item) => {
            return sectorBean.id == item.id
          });
          userSectors[findItemIndex] = sectorBean;
          setUserSectors([...userSectors]);
          setIsLoading(false);
          toast(response.data.appMessage);
        }
      }
    }).catch(ex => {
      console.log(ex);
      setIsLoading(false);
    });
  }

  return (
    <>
      <ToastContainer />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-3 left_sidebar">
            <div>
              <h1>{authUser().username}</h1>
              <div>
                <ul style={{ listStyleType: "none" }}>
                  <li style={{ cursor: "pointer" }} onClick={() => {
                    setActionType("all");
                  }}>All</li>
                  <li style={{ cursor: "pointer" }} onClick={() => {
                    setActionType("new");
                  }}>New</li>
                </ul>
              </div>
            </div>
          </div>
          {
            actionType == "all" && <div className="col-md-9">
              <h1>All Sectors</h1>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Sector</th>
                    <th scope="col">action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    userSectors.map((item, i) => {
                      return <tr key={i}>
                        <th scope="row">{i + 1}</th>
                        <td>{item.name}</td>
                        <td>{findName(item)}</td>
                        <td><span style={{
                          cursor: "pointer"
                        }} onClick={() => {
                          setActionType("edit");
                          setSectorBean({
                            id: item.id,
                            name: item.name,
                            sectorid: item.sectorid,
                            userid: authUser().id,
                            isaggreterms: item.isaggreterms
                          })
                        }}><i className="bi bi-pencil-square"></i>Edit</span></td>
                      </tr>
                    })
                  }
                </tbody>
              </table>
            </div>
          }
          {
            actionType == "new" && <div className="col-md-9">
              <h2 className="mb-3">
                Please enter your name and pick the Sectors you are currently involved
                in.
              </h2>
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
                      value={sectorBean.name}
                      onChange={handleChange}
                      placeholder="Name"
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-2 col-form-label">
                    Sectors
                  </label>
                  <div className="col-sm-10">
                    <div className="sectors_container">
                      <ul>
                        {
                          getListElement(childList)
                        }
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isaggreterms"
                    name="isaggreterms"
                    checked={sectorBean.isaggreterms}
                    onChange={handleInputCheck}
                  />
                  <label className="form-check-label" htmlFor="isaggreterms">
                    Agree to terms
                  </label>
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
          }
          {
            actionType == "edit" && <div className="col-md-9">
              <h2 className="mb-3">
                Please Edit Sectors you are currently involved
                in.
              </h2>
              <form onSubmit={handleSubmitForEdit}>
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
                      value={sectorBean.name}
                      onChange={handleChange}
                      placeholder="Name"
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-2 col-form-label">
                    Sectors
                  </label>
                  <div className="col-sm-10">
                    <div className="sectors_container">
                      <ul>
                        {
                          getListElement(childList)
                        }
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isaggreterms"
                    name="isaggreterms"
                    checked={sectorBean.isaggreterms}
                    onChange={handleInputCheck}
                  />
                  <label className="form-check-label" htmlFor="isaggreterms">
                    Agree to terms
                  </label>
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading && <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Loading...
                  </>}
                  {
                    !isLoading && "Update"
                  }
                </button>
              </form>
            </div>
          }
        </div>
      </div>
    </>

  );
}
export async function getServerSideProps(context) {
  try {
    const user = context.req.cookies.user
      ? JSON.parse(context.req.cookies.user)
      : null;
    if (!user) {
      return {
        redirect: {
          destination: "/login",
        },
      };
    }
    return {
      props: {},
    };
  } catch (error) {
    return {
      props: {
        user: null,
      },
    };
  }
}