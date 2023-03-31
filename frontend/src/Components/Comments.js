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
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem, MDBBtn } from 'mdb-react-ui-kit';

export default function Comments(props){

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [parent, setParent] = useState("");
  const [edit, setEdit] = useState("");

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


  const handleSubmit = (e) => {
    e.preventDefault();
    let form_data = new FormData();
    form_data.append('comment', comment);
    form_data.append('paper', props.paper);
    if (parent) {
      form_data.append('parent', parent);
    }
    if (edit) {
      form_data.append('edit', edit);
    }

    let URL = `http://127.0.0.1:8000/paper/${props.paper}/comments`;
    axios.post(URL, form_data, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
        .then(res => {
          setComment("");
          setParent("");
          let commentarea = document.querySelector("#comment-area");
          commentarea.value = "";
          setComments(res.data.comments)
        })
        .catch(err => console.log(err))
    };

    const handleEdit = (e, id, comment) => {
      e.preventDefault();
      setEdit(id);
      let commentarea = document.querySelector("#comment-area");
      commentarea.scrollIntoView();
      commentarea.value = comment;
      commentarea.focus();
    }

    const handleParent = (e, id) => {
      console.log(id)
      e.preventDefault();
      setParent(id);
      let commentarea = document.querySelector("#comment-area");
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
            let URL = `http://127.0.0.1:8000/paper/${props.paper}/comments`;
            axios.get(URL, {
              headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            })
                .then(res => {
                  setComments(res.data)
                })
                .catch(err => console.log(err))
              })
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
                        <a onClick={e => handlelikes(e, comment.id, 'like')} className="link-muted me-2">
                          <MDBIcon fas icon="thumbs-up me-1" />
                          {comment.likes}
                        </a>
                        <a onClick={e => handlelikes(e, comment.id, 'unlike')} className="link-muted">
                          <MDBIcon fas icon="thumbs-down me-1" />
                          {comment.unlikes}
                        </a>
                      </div>
                      <a onClick={e => handleParent(e, comment.id)} className="link-muted">
                        <MDBIcon fas icon="reply me-1" /> Reply
                      </a>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </div>
            {comment.children.map((child) => (
            <div key={child.id} style={{marginLeft: "3rem"}} className="d-flex flex-start mb-4">

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
                        <a onClick={e => handlelikes(e, child.id, 'like')} className="link-muted me-2">
                          <MDBIcon fas icon="thumbs-up me-1" />
                          {child.likes}
                        </a>
                        <a onClick={e => handlelikes(e, child.id, 'unlike')} className="link-muted">
                          <MDBIcon fas icon="thumbs-down me-1" />
                          {child.unlikes}
                        </a>
                        { child.personal ? 
                        <MDBDropdown className='m-2'>
                          <MDBDropdownToggle>...</MDBDropdownToggle>
                          <MDBDropdownMenu>
                            <MDBDropdownItem onClick={e => handleEdit(e, child.id, child.comment)} link>Edit</MDBDropdownItem>
                            <MDBDropdownItem link>Delete</MDBDropdownItem>
                          </MDBDropdownMenu>
                        </MDBDropdown>
                        : null
                        }
                      </div>
                      <a onClick={e => handleParent(e, comment.id)} className="link-muted">
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

        <div className="card-footer py-3 border-0" style={{maxWidth: '1000px', height: '200px', margin: '0 auto', backgroundColor: '#f8f9fa'}}>
            <div className="d-flex flex-start mt-3 w-100" >
              <img className="rounded-circle shadow-1-strong me-3"
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" alt="avatar" width="40"
                height="40" />
              <div className="form-outline w-100">
                <textarea onChange={(e) => setComment(e.target.value)} className="form-control" id="comment-area" rows="4"
                  style={{background: '#fff', border: "1px solid rgba(0,0,0,0.1)"}}></textarea>
                <label className="form-label" >Message</label>
              </div>
            </div>
            <div className="float-end mt-2 pt-1">
              <button type="button" onClick={handleSubmit} className="btn btn-primary btn-sm">Post comment</button>
            </div>
          </div>
      </MDBContainer>
    </section>
    )
}