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
  .card {
    border: solid black 1px;
    width: 100%;
    border-radius: 5px;
    padding: 16px;
  }
  .hover:hover {
    cursor: pointer;
    opacity: 0.5;
  }
  .card h2 {
    margin: 0px;
  }
  .card p {
    /** TODO: Add new line wrap displaying for p tag*/ 
  }
  form > * {
    width: 100%;
    margin: 0px;
  }
  textarea, input {
    display: block;
    padding: 16px;
    font-size: 1rem;
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
