import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component"

const News = (props)=> {

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const capitalizeFirstLetter = (string) => {    //capitalize first letter function in js 
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const updateNews = async ()=> {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;  //take data from url
    setLoading(true);
    let data = await fetch(url);        //wait for data to be fetched     
    props.setProgress(30);
    let parseData = await data.json();  //wait for data to convert into json
    props.setProgress(70);
    console.log(parseData);
    //here we set the state
    setArticles(parseData.articles)
    setTotalResults(parseData.totalResults)
    setLoading(false)
    
    props.setProgress(100);
  }

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsHut`;
    updateNews();
    //eslint-disable-next-line             
  }, [])

  // const handlePrevClick = async () => {
  //   setPage(page-1)
  //   updateNews();
  // }

  // const handleNextClick = async () => {
  //   setPage(page+1)
  //   updateNews();
  // }

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;  //take data from url
    setPage(page+1)
    let data = await fetch(url);        //wait for data to be fetched     
    let parseData = await data.json();  //wait for data to convert into json
    console.log(parseData);
    //here we set the state
    setArticles(articles.concat(parseData.articles))
    setTotalResults(parseData.totalResults)
    setLoading(false)
  };


    return (
      <>
        <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px  '}}>NewsHut - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
        {loading && <Spinner />}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {articles.map((element) => {
                return <div className="col-md-4" key={element.url}>
                  <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage}
                    newsUrl={element.url} author={element.author} date={element.publishedAt}
                    source={element.source.name} />
                </div>
              })}
            </div>
          </div>
        </InfiniteScroll>

      </>
    )
}

News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: 'general',
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News