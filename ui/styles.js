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
    margin: 0px;
  }
  
  form > * {
    width: 100%;
  }

  textarea, input {
    padding: 0.5rem;
    font-size: 1rem;
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
