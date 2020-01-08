import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ faceBox, imageUrl }) => {
    return(
        <div className='center'>
            <div className='absolute mt3'>
                <img id='InputImage' alt='Submitted' src={ imageUrl } width='500px' height='auto' />
                <div 
                    className='bounding-box' 
                    style={ {top: faceBox.topRow, left: faceBox.leftCol, bottom: faceBox.bottomRow, right: faceBox.rightCol } } 
                >
                </div>
            </div>
        </div>
    );
}

export default FaceRecognition;
