import './App.css';
import React, { Component } from 'react';
import reactDom from 'react-dom';
import pixabayApi from './Components/PixabayApi/PixabayApi';
import Searchbar from './Components/Searchbar/Searchbar';
import ImageGallery from './Components/ImageGallery/ImageGallery';
import Button from './Components/Button/Button';
import Spinner from './Components/Loader/Loader';
import Modal from './Components/Modal/Modal';
import './App.css';

export default class App extends Component {
  state = {
    status: 'idle',
    query: [],
    page: 1,
    name: '',
    showModal: false,
    modalImg: null,
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.name !== this.state.name) {
      this.setState({ status: 'pending' });

      pixabayApi(this.state.name, this.state.page)
        .then(query => query.hits)
        .then(query => this.setState({ query: query, status: 'resolved' }));
    }

    if (prevState.page !== this.state.page && this.state.page !== 1) {
      this.setState({ status: 'pending' });

      pixabayApi(this.state.name, this.state.page)
        .then(query => query.hits)
        .then(query =>
          this.setState(prevState => ({
            query: [...prevState.query, ...query],
            status: 'resolved',
          })),
        );
    }
    if (prevState.query !== this.state.query) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  handleSubmitForm = value => {
    this.setState({ name: value, page: 1 });
  };
  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  FindmodalImg = (id, img, tags) => {
    this.setState({ modalImg: { id: id, img: img, tags: tags } });
  };

  LoadBtn = () => {
    this.setState({ page: this.state.page + 1 });
  };

  render() {
    const { query, status, showModal, modalImg } = this.state;
    return (
      <div className="App">
        <Searchbar onSubmit={this.handleSubmitForm} />
        {status === 'pending' && <Spinner />}
        <ImageGallery
          query={query}
          toggleModal={this.toggleModal}
          bigImg={this.FindmodalImg}
        />
        {status === 'resolved' && <Button onClick={this.LoadBtn} />}
        {showModal && (
          <Modal closeModal={this.toggleModal} modalImg={modalImg} />
        )}
      </div>
    );
  }
}
