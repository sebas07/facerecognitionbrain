import React from 'react';

const FaceRecognition = ({ imageUrl }) => {
    return(
        <div className='center'>
            <div className='absolute mt3'>
                <img alt='Submitted' src={ imageUrl } width='500px' height='auto' />
            </div>
        </div>
    );
}

export default FaceRecognition;
