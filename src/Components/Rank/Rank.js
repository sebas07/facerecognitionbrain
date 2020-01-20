import React from 'react';

const Rank = ({currentUser}) => {
    return (
        <div>
            <div className='f2 white'>
                { `${ currentUser.name }, your current entry count is...` }
            </div>
            <div className='f1 white'>
                { currentUser.entries }
            </div>
        </div>
    );
}

export default Rank;
