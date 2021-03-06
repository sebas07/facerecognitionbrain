import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import Rank from './Components/Rank/Rank';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';

const particlesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  userInput: '',
  imageUrl: '',
  boxList: [],
  route: 'signin',
  isSignedIn: false,
  currentUser: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joinDate: ''
  }
}

class App extends Component {
  
  constructor() {
    super();

    this.state = initialState;
  }

  getFaceLocationsList = (data) => {
    let faceLocationsList = data.outputs[0].data.regions.map(tmpFace => {
      let faceBoundingBox = tmpFace.region_info.bounding_box;
      let faceId = tmpFace.id;
      return this.calculateFaceLocation(faceId, faceBoundingBox);
    });

    return faceLocationsList;
  }

  calculateFaceLocation = (clarifaiFaceId, clarifaiFaceBox) => {
    const inputImage = document.querySelector('#InputImage');
    const imageWidth = Number(inputImage.width);
    const imageHeight = Number(inputImage.height);

    return {
      key: clarifaiFaceId,
      leftCol: clarifaiFaceBox.left_col * imageWidth,
      topRow: clarifaiFaceBox.top_row * imageHeight,
      bottomRow: imageHeight - (clarifaiFaceBox.bottom_row * imageHeight),
      rightCol: imageWidth - (clarifaiFaceBox.right_col * imageWidth)
    }
  }

  displayFaceBox = (faceBoxList) => {
    this.setState({ boxList: faceBoxList });
  }

  onUserInputChanged = (event) => {
    this.setState({ userInput: event.target.value });
  }

  onFormSubmitted = () => {
    this.setState({ imageUrl: this.state.userInput });
    
    fetch('https://desolate-everglades-84247.herokuapp.com/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userInput: this.state.userInput
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response) {
        fetch('https://desolate-everglades-84247.herokuapp.com/image', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: this.state.currentUser.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.currentUser, { entries: count }));
        })
        .catch(err => console.log(err));
      }
      this.displayFaceBox(this.getFaceLocationsList(response))
    })
    .catch(err => console.log(err));
  }

  onFormReset = () => {
    this.setState({ userInput: '' });
    this.setState({ imageUrl: '' });
    let imageInput = document.querySelector('#image-input-control');
    if (imageInput) {
      imageInput.value = '';
    }
  }

  onRouteChanged = (route) => {
    if(route === 'signin') {
      this.setState(initialState);
    }
    this.setState({ isSignedIn: (route === 'home') });
    this.setState({ route: route });
  }

  loadUser = (signedInUser) => {
    this.setState({currentUser: 
      {
        id: signedInUser.id,
        name: signedInUser.name,
        email: signedInUser.email,
        entries: signedInUser.entries,
        joinDate: signedInUser.joinDate
      }
    });
  }

  render() {
    const { isSignedIn, route, boxList, imageUrl } = this.state;

    return (
      <div className="App">
        <Particles className='particles' params={ particlesOptions } />
        <div className='app-navigation pa3'>
          <Logo />
          <Navigation onRouteChanged={ this.onRouteChanged } isSignedIn={ isSignedIn } />
        </div>
        {
        route === 'home'
        ?
          <div>
            <Rank currentUser={ this.state.currentUser } />
            <ImageLinkForm 
              onUserInputChanged={ this.onUserInputChanged } 
              onFormSubmitted={ this.onFormSubmitted } 
              onFormReset={ this.onFormReset }
            />
            <FaceRecognition faceBoxesList={ boxList } imageUrl={ imageUrl } />
          </div>
        : 
          (
            route === 'signin'
            ? <SignIn loadUser={ this.loadUser } onRouteChanged={ this.onRouteChanged } />
            : <Register loadUser={ this.loadUser } onRouteChanged={ this.onRouteChanged } />
          )
        }
      </div>
    );
  }
  
}

export default App;
