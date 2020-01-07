import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onUserInputChanged, onFormSubmitted }) => {
    return (
        <div>
            <p className='f3'>
                {'This magic brain will detect faces in your pictures. Try it.'}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-70 center' type='text' onChange={ onUserInputChanged } />
                    <button 
                        className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                        onClick={ onFormSubmitted }
                    >
                        Detect
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;
