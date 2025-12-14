import React from 'react';
import Pagination from './Pagination';

const AppointmentList = React.memo(({ appointments = [], deleteAppointment, setEditingAppointment, searchTerm, setSearchTerm, sortOrder, setSortOrder, confirmationMessage, setConfirmationMessage, doctorFilter, setDoctorFilter, doctors, currentPage, totalPages, setCurrentPage }) => {

  const handleShare = (id) => {
    const url = `${window.location.origin}/termin/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setConfirmationMessage('Link in die Zwischenablage kopiert!');
    }).catch(err => {
      console.error('Fehler beim Kopieren des Links: ', err);
      // Fallback für ältere Browser oder bei Fehlern
      alert('Link konnte nicht automatisch kopiert werden. Bitte manuell kopieren: ' + url);
    });
  };

  return (
    <div className="appointment-list-container">
      <h2>Terminliste</h2>
      {confirmationMessage && (
        <div className="confirmation-message">{confirmationMessage}</div>
      )}
      <div className="list-controls">
        <div className="form-group">
          <label htmlFor="search">Suchen:</label>
          <input
            type="text"
            id="search"
            placeholder="Nach Patient oder Arzt suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="form-group">
            <label htmlFor="doctor-filter">Arzt filtern:</label>
            <select id="doctor-filter" value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)}>
                <option value="">Alle Ärzte</option>
                {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.name}>
                        {doctor.name}
                    </option>
                ))}
            </select>
        </div>
        <div className="form-group">
          <label htmlFor="sort">Sortieren nach:</label>
          <select id="sort" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Datum (aufsteigend)</option>
            <option value="desc">Datum (absteigend)</option>
          </select>
        </div>
      </div>

      {appointments.length === 0 && currentPage === 1 ? (
        <p>Keine Termine vorhanden.</p>
      ) : (
        <ul className="appointment-list">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="appointment-item">
              <p>
                <strong>Patient/in:</strong> {appointment.patientName}
              </p>
              <p>
                <strong>Arzt/Ärztin:</strong> {appointment.doctor.name}
              </p>
              <p>
                <small>{appointment.doctor.specialty} in {appointment.doctor.city}</small>
              </p>
              <p>
                <strong>Datum:</strong> {appointment.date}
              </p>
              <p>
                <strong>Uhrzeit:</strong> {appointment.time}
              </p>
              <div className="appointment-item-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingAppointment(appointment)}
                >
                  Bearbeiten
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleShare(appointment.id)}
                >
                  Teilen
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteAppointment(appointment.id)}
                  aria-label={`Termin für ${appointment.patientName} bei ${appointment.doctor.name} löschen`}
                >
                  Löschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
});

export default AppointmentList;
