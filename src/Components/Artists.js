import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';

class Artists extends Component {
  constructor(props){
    super(props);
    this.state = {
      artistsList: [],
      userSearched: '',
      isLoading: false,
      error: null,
      currentPage: 1,
      artistsPerPage: 2,
    };
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  componentDidUpdate() {
    window.scrollTo(0,0);
  }
  __handleUserChange = event => {
    this.setState({
      userSearched: event.target.value,
    })
  }
  __handleActivePage(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }
  __fetchArtists(e){
    const { userSearched } = this.state;
    if(userSearched.trim().length > 0){
      this.setState({ isLoading: true });
      fetch(`https://www.theaudiodb.com/api/v1/json/1/search.php?s=${userSearched}`)
      .then(response => {
        if(response.ok){
          return response.json();
        }
        else{
          throw new Error('Something went wrong ...');
        }
      }).then(data => {
          this.setState({
            userSearched: '',
            artistsList: data.artists,
            isLoading: false
          })
      })
      .catch(error => this.setState({ error, isLoading: false, userSearched: ''}));
    }
    else{
      e.preventDefault();
      return false;
    }
  }
  __renderArtists(){
    const { artistsList, artistsPerPage, currentPage } = this.state;
    const indexOfLastArtist = currentPage * artistsPerPage;
    const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
    const currentPageArtist = artistsList ? artistsList.slice(indexOfFirstArtist, indexOfLastArtist) : null;
    let renderArtistBlock = [];
    renderArtistBlock = currentPageArtist !== null ?
     currentPageArtist.map(item => {
       const MyLink = (props) => <Link to={{ pathname: `/albums/${item.strArtist}`, state: { artistdata: item} }}  {...props}  />
       return (
        <div key={item.idArtist} className="Artists-results">
          <div style={{ backgroundImage:`url(${item.strArtistThumb})`}} className="Artists-results__header">
            &nbsp;
          </div>
          <div className="Artists-results__info">
            <h3 className="name">{item.strArtist}</h3>
            <Button size="small" color="secondary"  variant="contained" component={MyLink}>
              View albums
            </Button>
          </div>
        </div>
       );
     })
     : <p>oops! No artist found</p>;
    return renderArtistBlock;
  }
  render() {
    const { userSearched, isLoading, error, artistsList, artistsPerPage, currentPage } = this.state;
    if(error){
      return <div className="Artists">
              <p>{error.message}</p>
            </div>;
    }

    if(isLoading){
      return <div className="Artists">
                <CircularProgress  color="secondary"/>
              </div>;
    }
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(artistsList ? artistsList.length / artistsPerPage : 1); i++) {
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
      <section className="Artists">
        <h4 className="Artists-title">Search by artist</h4>
        <form noValidate autoComplete="off" className="Artists-form">
          <TextField
            id="artist"
            label="Artist name"
            value={userSearched}
            onChange={this.__handleUserChange}
            margin="normal"
            fullWidth={true}
          />
          <Button variant="contained" color="secondary" onClick={this.__fetchArtists.bind(this)} type="submit">
            Search
          </Button>
        </form>
        <div>
          <h2>{ artistsList ? artistsList.length > 0 ? `Search results -` : '' : ''}</h2>
          {this.__renderArtists()}
        </div>
        <ul className="Albums-pages">
          {artistsList ? artistsList.length > 0 ? renderPageNumbers : '' : ''}
        </ul>
      </section>
    );
  }
}
export default Artists;
