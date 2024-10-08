import React, { useState, useContext } from 'react';
import { UserContext } from '../App';


function GroomingCard({ appointment, handleDeleteAppointment, setAppointments }) {
  
  const [isCompleted, setIsCompleted] = useState(appointment.isCompleted);

  const handleIsCompleted = (apptId) => {

    const requestData = {
        isCompleted: !isCompleted,
    };

    fetch(`/appointments/${apptId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to mark appointment as completed');
            }
            return res.json();
        })
        .then(setIsCompleted(!isCompleted))
        .catch(error => {
            console.error('Error marking appointment as completed:', error);
        });
};

  return (
    <div className='card'>
      <h1>{appointment.pet}</h1>
      <strong>Appointment Time: </strong> {appointment.appointment_time} <br/><br/>
      <strong>Groomer: </strong>{appointment.groomer}<br />
      <strong>isCompleted:</strong> {<button onClick={(e) => handleIsCompleted(appointment.id)} className='cancel-button' style={isCompleted ? {background: 'green'} : {background: 'hotpink'}}>{isCompleted ? 'True' : 'False'}</button>}<br />
      {isCompleted ? null 
          : <button
              type='button'
              className="delete-button"
              onClick={() => handleDeleteAppointment(appointment.id)}
            >Delete Appointment</button>}
    </div>
  )
}

function GroomingAppointments({ appointments, setAppointments, handleDeleteAppointment }) {

  const context = useContext(UserContext);
  const user = context.currentUser;

  const filteredAppointments = appointments.filter(appt => appt.owner_id === user.id && !appt.isCompleted)

  if (!filteredAppointments) {
    return <h1>Loading Appointments...</h1>
  }
    return (
      <>
        <h1>Grooming Appointments:</h1>
        <div>
        {filteredAppointments.length === 0 ? (
            <p>No appointments found</p>
        ) : (
          filteredAppointments.map(appointment => (
            <div key={appointment.id} className='pet-card-container'>
              <GroomingCard appointment={appointment} handleDeleteAppointment={handleDeleteAppointment} setAppointments={setAppointments}/>
            </div>
          ))
        )}
        </div>
      </>
      );
}

export default GroomingAppointments;
export {GroomingCard}