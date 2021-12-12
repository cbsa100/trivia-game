import React from 'react';
import './CatSelect.css';

const CatSelect = ({ categories, onCatSelect }) => {
  return (
    <div>
      <h3>choose a category</h3>
      <div className='options'>
        {categories &&
          categories.map((e, i) => (
            <div
              className='button'
              key={i}
              onClick={() => {
                onCatSelect(e.id);
              }}
            >
              {e.title}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CatSelect;
