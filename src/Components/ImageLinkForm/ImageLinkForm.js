import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onUserInputChanged, onFormSubmitted, onFormReset }) => {
    return (
        <div>
            <p className='f3'>
                {'This magic brain will detect faces in your pictures. Try it.'}
            </p>
            <div className='center'>
                <div className='image-link-form'>
                    <div className='form center pa3 br3'>
                        <input 
                            className='w-100 f4 pa2 center' 
                            type='text' 
                            onChange={ onUserInputChanged } 
                            id='image-input-control'
                        />
                    </div>
                    <div id='form-buttons' className='form center pa2 br3'>
                        <button 
                            className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                            onClick={ onFormSubmitted }
                        >
                            Detect
                        </button>
                        <button 
                            className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                            onClick={ onFormReset }
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;
