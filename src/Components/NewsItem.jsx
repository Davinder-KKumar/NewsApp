import React from 'react';

export default function NewsItem({ article }) {
  return (
    <div className="card h-100">
      <img 
        src={article.urlToImage} 
        className="card-img-top" 
        alt={article.title}
        style={{ height: '200px', objectFit: 'cover' }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
        }}
      />
      <div className="card-body">
        <h5 className="card-title" style={{ fontSize: '1.1rem' }}>
          {article.title}
        </h5>
        
        <div className="d-flex justify-content-between mb-2 text-muted small">
          <span>{article.source?.name}</span>
          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>
        
        <p className="card-text">{article.description}</p>
      </div>
      
      <div className="card-footer bg-transparent border-top-0">
        <a 
          href={article.url} 
          target="_blank" 
          rel="noreferrer" 
          className="btn btn-primary w-100"
        >
          Read Full Article
        </a>
      </div>
    </div>
  )
}