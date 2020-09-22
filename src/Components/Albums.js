import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import TrackRecord from './TrackRecord';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import backChev from '../Assets/back.svg';

const backStyle = {
  fontSize: '12px',
  padding: '15px 0',
  margin: '8px 0',
  width: '100%'
};

class Albums extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      error: false,
      albumList: [],
      artistdata: this.props.location.state.artistdata,
      currentPage: 1,
      albumsPerPage: 4,
    }
  }
  componentDidMount(){
    window.scrollTo(0,0);
    this.setState({ isLoading: true });
    fetch(`https://www.theaudiodb.com/api/v1/json/1/searchalbum.php?s=${this.props.match.params.artistName}`)
    .then(response => {
      if(response.ok){
        return response.json();
      }
      else{
        throw new Error('Something went wrong in fetching album information...');
      }
    }).then(data => {
        this.setState({
          albumList: data.album,
          isLoading: false
        })
    })
    .catch(error => this.setState({ error, isLoading: false }));
  }
  componentDidUpdate() {
    window.scrollTo(0,0);
  }
  __handleActivePage(event) {
    window.scrollTo(0,0);
    this.setState({
      currentPage: Number(event.target.id)
    });
  }
  __renderAlbums(){
    const { albumList, albumsPerPage, currentPage } = this.state;
    const indexOfLastAlbum = currentPage * albumsPerPage;
    const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
    const currentPageAlbum = albumList ? albumList.slice(indexOfFirstAlbum, indexOfLastAlbum) : null;
    let renderAlbumBlock = [];

    renderAlbumBlock = currentPageAlbum !== null ?
     currentPageAlbum.map(item => {
       return (
         <TrackRecord key={item.idAlbum} albumName={item.strAlbum} albumId={item.idAlbum} albumCover={item.strAlbumThumb}
         releaseYear={item.intYearReleased}/>
       );
     })
     : <p>oops! Nothing to show here</p>;
    return renderAlbumBlock;
  }
  render() {
    const { isLoading, error, artistdata, albumList, albumsPerPage, currentPage } = this.state;
    if(error){
      return <div className="Albums">
              <p>{error.message}</p>
            </div>;
    }

    if(isLoading){
      return <div className="Albums">
                <CircularProgress color="secondary"/>
              </div>;
    }
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(albumList ? albumList.length / albumsPerPage: 1); i++) {
      pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <li key={number} id={number}
          onClick={this.__handleActivePage.bind(this)} className={ currentPage == number ? 'current' : ''}>
          {number}
        </li>
      );
    });
    return (
      <section className="Albums">
        <Button component={Link} to="/" color="secondary" style={backStyle} className="Albums-back" >
          <img src={backChev} alt="back chevron" width="10px"/>Back to Search
        </Button>
        <div className="Albums-artist">
          <div style={{backgroundImage: `url(${artistdata.strArtistThumb})`}} className="Albums-artist__thumbnail">
            &nbsp;
          </div>
          <div className="Albums-artist__info">
            <h3>{artistdata.strArtist}</h3>
            <p>Style: {artistdata.strStyle ? artistdata.strStyle : 'NA'}</p>
            <p>Genre: {artistdata.strGenre ? artistdata.strGenre : 'NA'}</p>
            <p>Country: {artistdata.strCountry ? artistdata.strCountry : 'NA' }</p>
          </div>
        </div>
        <div className="Albums-listing">
          <h2>{ albumList ? albumList.length > 0 ? `Albums` : '' : ''}</h2>
          {this.__renderAlbums()}
        </div>
        <ul className="Albums-pages">
          {renderPageNumbers}
        </ul>
      </section>
    );
  }
}
export default Albums;
