import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import Rank from './Components/Rank/Rank';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
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

const app = new Clarifai.App({
  apiKey: '99e226a315c345aa867b7dcb3c2a2bbb'
 });

class App extends Component {
  constructor() {
    super();

    this.state = {
      userInput: '',
      imageUrl: '',
      box: {  }
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;

    const inputImage = document.querySelector('#InputImage');
    const imageWidth = Number(inputImage.width);
    const imageHeight = Number(inputImage.height);
    console.log(imageHeight, imageWidth);

    return {
      leftCol: clarifaiFace.left_col * imageWidth,
      topRow: clarifaiFace.top_row * imageHeight,
      bottomRow: imageHeight - (clarifaiFace.bottom_row * imageHeight),
      rightCol: imageWidth - (clarifaiFace.right_col * imageWidth)
    }
  }

  displayFaceBox = (faceBox) => {
    console.log(faceBox);

    this.setState({ box: faceBox });
  }

  onUserInputChanged = (event) => {
    this.setState({ userInput: event.target.value });
  }

  onFormSubmitted = () => {
    this.setState({ imageUrl: this.state.userInput });
    
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.userInput)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(error => console.log(error));
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={ particlesOptions } />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onUserInputChanged={ this.onUserInputChanged } 
          onFormSubmitted={ this.onFormSubmitted } 
        />
        <FaceRecognition faceBox={ this.state.box } imageUrl={ this.state.imageUrl } />
      </div>
    );
  }
}

export default App;

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

