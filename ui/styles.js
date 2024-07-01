import { css } from "../lib/lit.js";

export const styles = css`
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    gap: 1rem;
  }

  button {
    display: block;
    margin: 0px;
  }
  
  form > * {
    width: 100%;
    margin: 0px;
  }

  textarea, input {
    padding: 0.5rem;
    font-size: 1rem;
    margin: 0px;
  }

  input {
    display: block;
    width: 100%;
    margin: 0px;
  }
  button {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    background-color: white;
    color: black;
    border: solid 1px black;
    cursor: pointer;
  }

  [hide] {
    display: none;
  }
`
