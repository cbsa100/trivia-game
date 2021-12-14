import React from 'react';
import './CatSelect.css';

const CatSelect = ({ categories, onCatSelect }) => {
  return (
    <div className='gamebox category-select'>
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
              dangerouslySetInnerHTML={{ __html: e.title }}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default CatSelect;
