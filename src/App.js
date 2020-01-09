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
import Clarifai from 'clarifai';

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

const faceRecognitionApp = new Clarifai.App({
  apiKey: '99e226a315c345aa867b7dcb3c2a2bbb'
 });

class App extends Component {
  constructor() {
    super();

    this.state = {
      userInput: '',
      imageUrl: '',
      boxList: [],
      route: 'signin',
      isSignedIn: false
    }
  }

  getFaceLocationsList = (data) => {
    let faceLocationsList = data.outputs[0].data.regions.map(tmpFace => {
      let faceBoundingBox = tmpFace.region_info.bounding_box;
      return this.calculateFaceLocation(faceBoundingBox);
    });

    return faceLocationsList;
  }

  calculateFaceLocation = (clarifaiFace) => {
    // const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const inputImage = document.querySelector('#InputImage');
    const imageWidth = Number(inputImage.width);
    const imageHeight = Number(inputImage.height);

    return {
      leftCol: clarifaiFace.left_col * imageWidth,
      topRow: clarifaiFace.top_row * imageHeight,
      bottomRow: imageHeight - (clarifaiFace.bottom_row * imageHeight),
      rightCol: imageWidth - (clarifaiFace.right_col * imageWidth)
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
    
    faceRecognitionApp.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.userInput)
    .then(response => this.displayFaceBox(this.getFaceLocationsList(response)))
    .catch(error => console.log(error));
  }

  onRouteChanged = (route) => {
    this.setState({ isSignedIn: (route === 'home') });
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, route, boxList, imageUrl } = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={ particlesOptions } />
        <Navigation onRouteChanged={ this.onRouteChanged } isSignedIn={ isSignedIn } />
        {
        route === 'home'
        ?
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm 
              onUserInputChanged={ this.onUserInputChanged } 
              onFormSubmitted={ this.onFormSubmitted } 
            />
            <FaceRecognition faceBoxesList={ boxList } imageUrl={ imageUrl } />
          </div>
        : 
          (
            route === 'signin'
            ? <SignIn onRouteChanged={ this.onRouteChanged } />
            : <Register onRouteChanged={ this.onRouteChanged } />
          )
        }
      </div>
    );
  }
}

export default App;
