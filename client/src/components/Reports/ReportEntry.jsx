import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReportEntry = ({ props }) => {
  const nav = useNavigate()
  const onEditClick = () => {
    nav(`/Report/${props.reportId}`, {state:{...props}});
  }
  return (
    <div>
      <div className="card">
        <img className="card-img-top" src={props.image} alt="Report Image"     
          style={{
          width: '100%',
          height: '250px',
          objectFit: 'cover'
        }} />
        <div className="card-body">
          <h5 className="card-title">Description:</h5>
          <p className="card-text">{props.data}</p>
          <h5 className="card-title">Location:</h5>
          <p className="card-text">{props.location}</p>
          <h5 className="card-title">Reported at:</h5>
          <p className="card-text">{props.reportedAt}</p>
          <h5 className="card-title">Status:</h5>
          <p className={`status ${props.isFixed ? 'text-success fw-bold' : 'text-danger fw-bold'}`}>
            {props.isFixed ? "Issue fixed!" : "Issue has not been fixed"}
          </p>
          <button onClick={onEditClick} className="btn btn-primary w-100">Edit</button>
        </div>
      </div>
    </div>
  );
};

export default ReportEntry;
