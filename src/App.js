import './App.css';
import React, { Component } from 'react';
import reactDom from 'react-dom';
import pixabayApi from './сomponents/PixabayApi/PixabayApi';
import Searchbar from './сomponents/Searchbar/Searchbar';
import ImageGallery from './сomponents/ImageGallery/ImageGallery';
import Button from './сomponents/Button/Button';
import Spinner from './сomponents/Loader/Loader';
import Modal from './сomponents/Modal/Modal';

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

  findmodalImg = (id, img, tags) => {
    this.setState({ modalImg: { id: id, img: img, tags: tags } });
  };

  loadBtn = () => {
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
          bigImg={this.findmodalImg}
        />
        {status === 'resolved' && <Button onClick={this.loadBtn} />}
        {showModal && (
          <Modal closeModal={this.toggleModal} modalImg={modalImg} />
        )}
      </div>
    );
  }
}
