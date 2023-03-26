import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";

export default function Comments(props){

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [parent, setParent] = useState("");
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    let URL = `http://127.0.0.1:8000/paper/${props.paper}/comments`;

    axios.get(URL, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
        .then(res => {
          console.log(res.data)
          setComments(res.data)
        })
        .catch(err => console.log(err))
  }, []);

  // useEffect(() => {
  //   let URL = `http://127.0.0.1:8000/review/1/all`;

  //   axios.get(URL, {
  //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
  //   })
  //       .then(res => {
  //         console.log(res.data.data)
  //         setLikes(res.data.data)
  //       })
  //       .catch(err => console.log(err))
  // }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    let form_data = new FormData();
    form_data.append('comment', comment);
    form_data.append('paper', props.paper);
    if (parent) {
      form_data.append('parent', parent);
    }

    let URL = `http://127.0.0.1:8000/paper/${props.paper}/comments`;
    axios.post(URL, form_data, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
        .then(res => {
          setComment("");
          setParent("");
          let commentarea = document.querySelector(".comment-area");
          commentarea.value = "";
          setComments(res.data.comments)
        })
        .catch(err => console.log(err))
    };

    const handleParent = (e, id) => {
      console.log(id)
      e.preventDefault();
      setParent(id);
      let commentarea = document.querySelector(".comment-area");
      commentarea.focus();
      commentarea.scrollIntoView();
    }

    const handlelikes = (e, id, type) => {
      e.preventDefault();
      let URL = `http://127.0.0.1:8000/review/${id}/${type}`;
      axios.get(URL, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      })
          .then(res => {
            console.log(res.data)
          })
          .catch(err => console.log(err))
    }


    return(
      <section className="vh-100">
        <h1 style={{marginTop: '4rem', textAlign: 'center'}}>Reviews</h1>
      <MDBContainer className="py-5" style={{ maxWidth: "2000px" }}>
        {comments.map((comment) => (
        <MDBRow className="justify-content-center" key={comment.id}>
          <MDBCol md="11" lg="9" xl="7">
            
            <div className="d-flex flex-start mb-4">

              <MDBCard className="w-100">
                <MDBCardBody className="p-4">
                  <div>
                    <MDBTypography style={{textTransform: "capitalize"}} tag="h5"><a href={`/profile/${comment.user}`}>{comment.user}</a></MDBTypography>
                    <p className="small"></p>
                    <p>
                      {comment.comment}
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <a href="#!" className="link-muted me-2">
                          <MDBIcon fas icon="thumbs-up me-1" />
                          {comment.likes}
                        </a>
                        <a href="#!" className="link-muted">
                          <MDBIcon fas icon="thumbs-down me-1" />
                          {comment.unlikes}
                        </a>
                      </div>
                      <a href="#!" className="link-muted">
                        <MDBIcon fas icon="reply me-1" /> Reply
                      </a>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </div>
            {comment.children.map((child) => (
            <div style={{marginLeft: "3rem"}} className="d-flex flex-start mb-4">

              <MDBCard className=" w-100">
                <MDBCardBody className="p-4">
                  <div>
                    <MDBTypography style={{textTransform: "capitalize"}} tag="h5"><a href={`/profile/${child.user}`}> {child.user}</a></MDBTypography>
                    <p className="small">5 hours ago</p>
                    <p>
                      {child.comment}
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <a href="#!" className="link-muted me-2">
                          <MDBIcon fas icon="thumbs-up me-1" />
                          {child.likes}
                        </a>
                        <a href="#!" className="link-muted">
                          <MDBIcon fas icon="thumbs-down me-1" />
                          {child.unlikes}
                        </a>
                      </div>
                      <a href="#!" className="link-muted">
                        <MDBIcon fas icon="reply me-1" /> Reply
                      </a>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </div>
            ))}
          </MDBCol>
        </MDBRow>
        ))}
      </MDBContainer>
    </section>
    )
}