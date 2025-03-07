import React from 'react';
import styled from 'styled-components';

const Button = (props) => {
  return (
    <StyledWrapper>
      <button className="button"
        onClick={props.onClick}
        
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
        </svg>
        <div className="text">
          Send
        </div>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    background-color: #ffffff00;
    color: #fff;
    width: 8.5em;
    height: 143%;
    border: #3654ff 0.2em solid;
    border-radius: 11px;
    text-align: right;
    transition: all 0.6s ease;
  }

  .button:hover {
    background-color: #3654ff;
    cursor: pointer;
  }

  .button svg {
    width: 1.6em;
    margin: -0.2em 0.8em 1em;
    position: absolute;
    display: flex;
    transition: all 0.6s ease;
  }

  .button:hover svg {
    transform: translateX(5px);
  }

  .text {
    margin: 0 1.5em
  }`;

export default Button;
