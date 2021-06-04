import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

export class CreateProducts extends Component {
  state = {
    formData: [],
    product: {},
    url: 'http://localhost:3001/products/',
    loading: true,
  };

  handleFileChange = (e) => {
    const formData = new FormData();

    if (e.target.files[0]) {
      formData.append('cover', e.target.files[0]);
      this.setState((state) => {
        return { formData: formData };
      });
    }
  };

  handleChange = (e) => {
    this.setState((state) => {
      return {
        product: { ...this.state.product, [e.target.id]: e.target.value },
      };
    });
  };

  // fileUpload = async (id) => {
  //   try {
  //     const res = await fetch(this.state.url + `${id}/upload`, {
  //       method: 'POST',
  //       body: this.state.formData,
  //     });
  //     if (res.ok) {
  //       const upload = await res;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  postProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(this.state.url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(this.state.product),
      });
      if (!res.ok) {
        console.log('Something went wrong');
      } else {
        let data = await res.json();

        this.fileUpload(data.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  getProduct = async () => {
    try {
      const res = await fetch(this.state.url + this.props.match.params.id);
      console.log(res);
      if (!res.ok) {
        console.log('Something wen wrong');
      }
      const data = await res.json();
      this.setState((state) => {
        return { product: data, loading: false };
      });
    } catch (error) {
      console.log(error);
    }
  };

  putProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(this.state.url + this.props.match.params.id, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(this.state.product),
      });
      if (!res.ok) {
        throw 'something went wrong';
      } else {
        if (this.state.formData.length > 0) {
          let data = await res.json();
          this.fileUpload(data.id);
        }
      }
    } catch (error) {}
  };

  deleteProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(this.state.url + this.props.match.params.id, {
        method: 'DELETE',
      });
      if (!res.ok) throw 'something went wrong';
    } catch (error) {}
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      this.getProduct();
    } else {
      this.setState((state) => {
        return { loading: false };
      });
    }
  }

  render() {
    if (this.state.loading) {
      return <div>loading</div>;
    } else {
      return (
        <div className="container-md" style={{ marginTop: '125px' }}>
          <div className="row mt-2 d-flex justify-content-center">
            <h1>Add products</h1>
          </div>
          <div className="row d-flex justify-content-center">
            <form className="product-form w-50">
              <div className="form-group">
                <label htmlFor="_id">ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="_id"
                  placeholder="id will be generated"
                  disabled
                />
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={this.state.product.name}
                  onChange={(e) => this.handleChange(e)}
                  placeholder="Name of the product"
                  required
                />
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={this.state.product.description}
                  onChange={(e) => this.handleChange(e)}
                  placeholder="Description"
                  required
                />
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  className="form-control"
                  id="brand"
                  value={this.state.product.brand}
                  onChange={(e) => this.handleChange(e)}
                  placeholder="brand name"
                  required
                />
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  id="imageUrl"
                  value={this.state.product.imageUrl}
                  onChange={(e) => this.handleChange(e)}
                  placeholder="Url"
                  required
                />
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  value={this.state.product.price}
                  onChange={(e) => this.handleChange(e)}
                  placeholder="price in Euro"
                  required
                />
                <Form.File
                  id="custom-picture"
                  label="Cover"
                  onChange={(e) => this.handleFileChange(e)}
                />
              </div>
              {!this.props.match.params.hasOwnProperty('id') && (
                <button
                  type="button"
                  className="btn btn-primary float-right"
                  onClick={(e) => {
                    this.postProduct(e);
                    this.props.history.push('/LatestReleases');
                  }}
                >
                  <ion-icon name="add-circle-outline" />
                </button>
              )}
              {this.props.match.params.hasOwnProperty('id') && (
                <button
                  type="button"
                  className="backoffice-delbtn btn btn-danger float-right mx-1"
                  onClick={(e) => {
                    this.deleteProduct(e);
                    this.props.history.push('/LatestReleases');
                  }}
                >
                  <ion-icon name="close-circle-outline" />
                </button>
              )}
              {this.props.match.params.hasOwnProperty('id') && (
                <button
                  type="button"
                  className="backoffice-editbtn btn btn-light float-right mx-1"
                  onClick={(e) => {
                    this.putProduct(e);
                    this.props.history.push('/LatestReleases');
                  }}
                >
                  <ion-icon name="create-outline" title="edit" />
                </button>
              )}
            </form>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(CreateProducts);
