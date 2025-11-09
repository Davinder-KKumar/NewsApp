import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState("");
  const [language, setLanguage] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const qp = searchParams.get("q") ?? "All";
    const lang = searchParams.get("language") ?? "hi";
    setQ(qp);
    setLanguage(lang);
    setInputValue(qp === "All" ? "" : qp);
  }, [searchParams]);

  function handleSubmit(e) {
    e.preventDefault();
    const newQ = inputValue.trim() || "All";
    setSearchParams({ q: newQ, language });
  }

  return (
    <nav className="navbar navbar-expand-lg background sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand text-light" to={`/?q=${q}&language=${language}`}>NewsApp</Link>
        <button className="navbar-toggler navbar-dark" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className="nav-link text-light" 
                to={`/?q=All&language=${language}`}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to={`/?q=Politics&language=${language}`}>Politics</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to={`/?q=Crime&language=${language}`}>Crime</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/register">Register</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/admin">Admin</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to={`/?q=Education&language=${language}`}>Education</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to={`/?q=Entertainment&language=${language}`}>Entertainment</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to={`/?q=Sports&language=${language}`}>Sports</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to={`/?q=Cricket&language=${language}`}>Cricket</Link>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link text-light dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Other
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to={`/?q=IPL&language=${language}`}>IPL</Link></li>
                <li><Link className="dropdown-item" to={`/?q=World&language=${language}`}>World</Link></li>
                <li><Link className="dropdown-item" to={`/?q=India&language=${language}`}>India</Link></li>
                <li><Link className="dropdown-item" to={`/?q=Economics&language=${language}`}>Economics</Link></li>
                <li><Link className="dropdown-item" to={`/?q=Technology&language=${language}`}>Technology</Link></li>
                <li><Link className="dropdown-item" to={`/?q=Science&language=${language}`}>Science</Link></li>
                <li><Link className="dropdown-item" to={`/?q=Jokes&language=${language}`}>Jokes</Link></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link text-light dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {language === 'hi' ? 'हिंदी' : 'English'}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <button 
                    className={`dropdown-item ${language === 'hi' ? 'active' : ''}`}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('language', 'hi');
                      setSearchParams(params);
                    }}
                  >
                    हिंदी
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'en' ? 'active' : ''}`}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('language', 'en');
                      setSearchParams(params);
                    }}
                  >
                    English
                  </button>
                </li>
              </ul>
            </li>

          </ul>

          <div className="d-flex align-items-center w-100 justify-content-between ms-4">
            {/* Search Form */}
            <form className="d-flex me-3" role="search" onSubmit={handleSubmit}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search News..."
                aria-label="Search"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button className="btn btn-outline-light" type="submit">Search</button>
            </form>

            {/* Login/Signup Buttons - On the right */}
            <div className="d-flex">
              <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
              <Link to="/register" className="btn btn-outline-light me-2">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}