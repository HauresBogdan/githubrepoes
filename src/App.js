import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Pagination from "react-js-pagination";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [currentPage, setCurrentPage] = useState({ activePage: 1 });
  const [repoes, setRepoes] = useState([]);
  const [currentLanguage,setCurrentLanguage] = useState("Javascript");

  function handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    setCurrentPage({ activePage: pageNumber });
  }

  const languages = ["Javascript","Python","Java","Php","C#","C++","Typescript","Shell","C","Ruby"];

  function selectLanguage(event){
      const language = event.target.value;
      setCurrentLanguage(language);
  }

  useEffect(() => {
    axios
      .get(
        `https://api.github.com/search/repositories?q=language:${currentLanguage}&sort=stars&order=desc&per_page=20&page=${currentPage.activePage}`
      )
      .then(function (response) {
        // handle success
        console.log(response.data.items);
        setRepoes(response.data.items);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    window.scroll({ top: 0, left: 0 });
  }, [currentPage.activePage,currentLanguage]);

  return (
    <div className="App">
      <h1 className="text-center py-4 mb-3 bg-secondary text-white ">
        Browse Top Repoes
      </h1>

      {/* language select */}
      <div className="d-flex justify-content-center mb-3 ">
        <select 
        value={currentLanguage} 
        onChange={selectLanguage} 
        className="form-control-lg bg-light">
          {languages.map(language=>
            <option key={language} className="text-center" value={language}>{language}</option>          
            )}
          
        </select>
      </div>

      {/* the table */}
      <table className="container col-lg-10 table  mb-5 table-striped table-bordered">
        <thead>
          <tr className="table-active">
            <th scope="col">Name</th>
            <th scope="col">Owner</th>
            <th scope="col">Description</th>

            <th scope="col">Created</th>
            <th scope="col">Forks</th>
            <th scope="col">Licence</th>

            <th scope="col">Language</th>
            <th scope="col">Clone_url</th>
            <th scope="col">Homepage</th>
          </tr>
        </thead>
        <tbody>
          {repoes !== undefined &&
            repoes.map((repo) => (
              <tr key={repo.id}>
                <td className="font-weight-bold">
                  {repo.name.charAt(0).toUpperCase() + repo.name.slice(1)}
                </td>
                <td>
                  {repo.owner && (
                    <img
                      className="avatar"
                      src={repo.owner.avatar_url}
                      alt="avatar"
                    />
                  )}
                </td>
                <td>{repo.description}</td>

                <td>{repo.created_at.slice(0, 10)}</td>

                <td>{repo.forks}</td>
                <td>
                  {repo.license && repo.license.key !== null
                    ? repo.license.key.toUpperCase()
                    : "other"}
                </td>

                <td>{repo.language}</td>
                <td>{repo.clone_url}</td>

                {repo.homepage === "" ? (
                  <td className="text-center">None</td>
                ) : (
                  <td className="text-center">
                    <a
                      className="badge badge-secondary "
                      href={`${repo.homepage}`}
                    >
                      Go
                    </a>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center bg-secondary p-5 align-items-center">
        <Pagination
          activePage={currentPage.activePage}
          itemsCountPerPage={20}
          totalItemsCount={1000}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        />
      </div>
    </div>
  );
}

export default App;
