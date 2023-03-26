import React from "react";
import { useParams } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardFooter,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";
import axios from "axios";

export default function App() {
  const { paper, username } = useParams();
  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    const fetchUser = () => {
    let URL = `http://127.0.0.1:8000/chat/${paper}/messages`;
    axios.get(URL, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
        .then(res => {
          console.log(res.data)
          if (res.data.error === 'No chats found.') {
            setTimeout(() => {  console.log("World!"); }, 5000);
          }
          else {
          setMessages(res.data.chats)
          }
        })
        .catch(err => console.log(err))
    };
    const interval = setInterval(() => {
      fetchUser();
    }
    , 1000);
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    let form_data = new FormData();
    form_data.append('message', message);

    let URL = `http://127.0.0.1:8000/chat/${paper}/messages`;

    axios.post(URL, form_data, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
        .then(res => {
          console.log(res.data)
          setMessage("");
          document.getElementById("exampleFormControlInput1").value = "";
          setMessages(res.data.chats)
        })
        .catch(err => console.log(err))
  };



  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
      <MDBRow className="d-flex justify-content-center">
        <MDBCol md="10" lg="8" xl="6">
          <MDBCard id="chat2" style={{ borderRadius: "15px" }}>
            <MDBCardHeader className="mb-2 d-flex justify-content-between align-items-center p-3">
              <h5 className="mb-0">Chat</h5>
              <MDBBtn color="primary" size="sm" rippleColor="dark">
                Let's Chat App
              </MDBBtn>
            </MDBCardHeader>
             {messages.map((message) => (
              <MDBCardBody style={{padding: '0rem 1.5rem'}} key={message.id}>
                {message.personal !== 'true' ? (
                <div className="d-flex flex-row justify-content-start">
                  <div>
                    <a href={`/profile/${message.sender}`} className="small p-2 ms-3 rounded-3 text-muted">{message.sender}</a>
                    <p
                      className="small p-2 ms-3 rounded-3"
                      style={{ backgroundColor: "#f5f6f7" }}
                    >
                      {message.message}
                    </p>
                  </div>
                </div>
                ) : (
                <div className="d-flex flex-row justify-content-end">
                  <div>
                    <a href={`/profile/${message.sender}`} className="small p-2 ms-3 rounded-3 text-muted">{message.sender}</a>
                    <p className="small p-2 text-white rounded-3 bg-primary">
                      {message.message}
                    </p>
                  </div>
                </div>
                )}
              </MDBCardBody>
              ))}
            <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
              <input
                type="text"
                className="form-control form-control-lg"
                id="exampleFormControlInput1"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message"
              ></input>
              <a className="ms-3" onClick={sendMessage}>
                <MDBIcon fas icon="paper-plane" />
              </a>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}