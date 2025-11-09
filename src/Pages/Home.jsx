import React, { useEffect, useState, useCallback } from 'react';
import NewsItem from '../Components/NewsItem';
import { useSearchParams } from 'react-router-dom';
import { NewsService } from '../services/news.service';

export default function Home() {
  const [searchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState(searchParams.get("q") ?? "All");



  const getAPIData = useCallback(async (searchQuery) => {
    const language = searchParams.get("language") ?? "en";
    const country = language === 'hi' ? 'in' : 'us';
    
    try {
      setLoading(true);
      setError(null);

      if (searchQuery === "All") {
        const categories = [
          { id: 'general news', title: 'Top Stories' },
          { id: 'business', title: 'Business' },
          { id: 'technology', title: 'Technology' },
          { id: 'entertainment', title: 'Entertainment' },
          { id: 'sports', title: 'Sports' },
          { id: 'science', title: 'Science' },
          { id: 'health', title: 'Health' }
        ];

        try {
          const results = await Promise.all(
            categories.map(async (category) => {
              try {
                const response = await NewsService.getTopHeadlines({
                  country,
                  pageSize: 10,
                  q: category.id
                });

                if (response.articles && response.articles.length > 0) {
                  return response.articles
                    .filter(article => 
                      article.urlToImage && 
                      article.description && 
                      article.title
                    )
                    .map(article => ({
                      ...article,
                      category: category.title
                    }));
                }
                return [];
              } catch (error) {
                console.error(`Error fetching ${category.title}:`, error);
                return [];
              }
            })
          );

          // Flatten and remove empty arrays
          const allArticles = results.flat().filter(Boolean);
          setArticles(allArticles);
        } catch (error) {
          console.error('Error fetching categories:', error);
          throw error;
        }
      } else {
        try {
          const response = await NewsService.searchNews({
            q: searchQuery,
            language,
            pageSize: 30
          });

          if (response.articles && response.articles.length > 0) {
            const filteredArticles = response.articles.filter(article => 
              article.urlToImage && 
              article.description && 
              article.title
            );
            setArticles(filteredArticles);
          } else {
            setArticles([]);
          }
        } catch (error) {
          console.error('Search error:', error);
          throw new Error("Search failed");
        }
      }
    } catch (error) {
      console.error('API Error:', error);
      setError(error.message);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    console.log('useEffect running...');
    const query = searchParams.get("q") ?? "All";
    setQ(query);
    getAPIData(query);
  }, [searchParams, getAPIData]);

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col">
          <h3 className="text-center mb-4">
            {q === "All" ? "Latest News" : `${q} News`}
          </h3>

          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {q === "All" ? (
                // Group articles by category
                ['Top Stories', 'Business', 'Technology', 'Entertainment', 'Sports', 'Science', 'Health'].map(category => {
                  const categoryArticles = articles.filter(article => article.category === category);
                  return categoryArticles.length > 0 ? (
                    <div key={category} className="mb-5">
                      <h4 className="border-bottom pb-2 mb-3">
                        {category}
                        <span className="text-muted fs-6 ms-2">
                          ({categoryArticles.length} articles)
                        </span>
                      </h4>
                      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {categoryArticles.map((article, index) => (
                          <div className="col" key={article.url || index}>
                            <NewsItem article={article} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })
              ) : (
                // Show search results
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {articles.map((article, index) => (
                    <div className="col" key={article.url || index}>
                      <NewsItem article={article} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="alert alert-info text-center" role="alert">
              No news articles available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}