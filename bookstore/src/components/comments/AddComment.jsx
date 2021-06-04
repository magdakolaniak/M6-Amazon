import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { Component } from "react";
import { join } from "path";

class AddComment extends Component {
  state = {
    saveSuccess: false,
    url: "http://localhost:3001/reviews",
  };

  handleCommentUpdate = (e) => {
    this.props.onCommentUpdate(e);
  };

  handleNewCommentSubmit = (e) => {
    e.preventDefault();
    this.props.onNewCommentSubmit(true);
  };

  // componentDidUpdate = async (prevProps) => {
  //   if (prevProps.newComment !== this.props.newComment) {
  //     try {
  //       let response = await fetch(this.state.url, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(this.props.currComment),
  //       });
  //       if (response.ok) {
  //          this.props.onNewCommentSubmit(true);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  putComment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(this.state.url + this.props.productId, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(this.props.newComment),
      });
      if (!res.ok) throw "something went wrong";
      this.props.onNewCommentSubmit(true);
    } catch (error) {}
  };

  postComment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(this.state.url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ...this.props.currComment,
          _id: this.props.productId,
        }),
      });
      if (!res.ok) throw "something went wrong";
      this.props.onNewCommentSubmit(true);
    } catch (error) {}
  };

  render() {
    return (
      <>
        <h6 className='mt-3'>Add Comments</h6>
        {this.state.saveSuccess && (
          <Alert
            variant='success'
            className='position-absolute'
            style={{
              top: 0,
            }}>
            Your comment got added
          </Alert>
        )}
        <Form onSubmit={this.handleNewCommentSubmit}>
          <Row>
            <Col>
              <Form.Group controlId='comment'>
                <Form.Label>Your comment</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={1}
                  value={this.props.currComment.comment}
                  onChange={(event) => this.handleCommentUpdate(event)}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='rate'>
                <Form.Label>Rating</Form.Label>
                <Form.Control
                  as='select'
                  onChange={(event) => this.handleCommentUpdate(event)}
                  required>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          {/* <button
            type='button'
            onClick={(e) => this.postComment(e)}
            className='backoffice-editbtn btn btn-light float-right mx-1'>
            <ion-icon name='create-outline' />
          </button> */}
          <button
            type='button'
            className='btn btn-primary float-right'
            onClick={(e) => {
              this.postComment(e);
            }}>
            <ion-icon name='add-circle-outline' />
          </button>
        </Form>
      </>
    );
  }
}

export default AddComment;
