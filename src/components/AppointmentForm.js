import React, { useState, useEffect, useMemo } from 'react';
import Spinner from './Spinner';

const initialState = {
  patientName: '',
  doctorId: '',
  date: '',
  time: '',
};

const AppointmentForm = React.memo(({ addAppointment, doctors, specialties, cities, editingAppointment, setEditingAppointment, updateAppointment }) => {
  const [formData, setFormData] = useState(initialState);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = editingAppointment !== null;

  useEffect(() => {
    if (!selectedSpecialty || !selectedCity || isEditing) {
      setFilteredDoctors([]);
      return;
    }
    setIsLoading(true);
    // Simuliert eine kurze Ladezeit wie bei einem API-Aufruf
    const timer = setTimeout(() => {
      const filtered = doctors.filter(doc => doc.specialty === selectedSpecialty && doc.city === selectedCity);
      setFilteredDoctors(filtered);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [doctors, selectedSpecialty, selectedCity, isEditing]);

  useEffect(() => {
    if (isEditing && editingAppointment && editingAppointment.doctor) {
      setFormData({
        patientName: editingAppointment.patientName,
        doctorId: editingAppointment.doctor.id.toString(),
        date: editingAppointment.date,
        time: editingAppointment.time,
      });
      setSelectedSpecialty(editingAppointment.doctor.specialty);
      setSelectedCity(editingAppointment.doctor.city);
      // Beim Bearbeiten die Ärzte direkt laden, ohne Ladeanzeige
      setFilteredDoctors(doctors.filter(doc => doc.specialty === editingAppointment.doctor.specialty && doc.city === editingAppointment.doctor.city));
    } else {
      setFormData(initialState);
      setSelectedSpecialty('');
      setSelectedCity('');
    }
  }, [editingAppointment, isEditing, doctors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      // Wenn Fachrichtung oder Stadt geändert wird, Arzt zurücksetzen
      ...( (name === 'specialty' || name === 'city') && { doctorId: '' }),
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.doctorId || !formData.date || !formData.time || !selectedSpecialty || !selectedCity) {
      alert('Bitte füllen Sie alle Felder aus.');
      return;
    }

    // Validierung für Termine in der Vergangenheit (nur bei neuen Terminen)
    if (!isEditing) {
      const now = new Date();
      const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
      // Sekunden und Millisekunden für einen fairen Vergleich ignorieren
      now.setSeconds(0, 0);

      if (appointmentDateTime < now) {
        alert('Termine können nicht in der Vergangenheit angelegt werden.');
        return;
      }
    }

    const selectedDoctor = doctors.find(doc => doc.id === parseInt(formData.doctorId, 10));
    const appointmentData = {
        patientName: formData.patientName,
        doctor: selectedDoctor,
        date: formData.date,
        time: formData.time
    };

    if (isEditing) {
      updateAppointment(editingAppointment.id, appointmentData);
    } else {
      addAppointment(appointmentData);
    }

    // Formularfelder nach dem Absenden leeren
    setFormData(initialState);
    setSelectedSpecialty('');
    setSelectedCity('');
    setEditingAppointment(null);
  };

  const handleCancel = () => {
    setFormData(initialState);
    setSelectedSpecialty('');
    setSelectedCity('');
    setEditingAppointment(null);
  };

  return (
    <div className="form-container">
      <form className="appointment-form" onSubmit={handleSubmit}>
        <h2>{isEditing ? 'Termin bearbeiten' : 'Neuen Termin hinzufügen'}</h2>
        <div className="form-group">
          <label htmlFor="patientName">Patientenname:</label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="specialty">Fachrichtung:</label>
          <select id="specialty" name="specialty" value={selectedSpecialty} onChange={(e) => {
            setSelectedSpecialty(e.target.value);
            // Arzt-Auswahl zurücksetzen, wenn sich die Fachrichtung ändert
            setFormData(prev => ({ ...prev, doctorId: '' }));
          }} required>
            <option value="">Bitte wählen...</option>
            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="city">Stadt:</label>
          <select id="city" name="city" value={selectedCity} onChange={(e) => {
            setSelectedCity(e.target.value);
            // Arzt-Auswahl zurücksetzen, wenn sich die Stadt ändert
            setFormData(prev => ({ ...prev, doctorId: '' }));
          }} required>
            <option value="">Bitte wählen...</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="doctorId">Arzt:</label>
          <div className="doctor-select-wrapper">
            <select
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              disabled={isLoading || (filteredDoctors.length === 0 && !isEditing)}
            >
              <option value="">Bitte zuerst Fachrichtung und Stadt wählen</option>
              {filteredDoctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
            {isLoading && <Spinner />}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="date">Datum:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]} // Verhindert die Auswahl vergangener Daten
            required />
        </div>
        <div className="form-group">
          <label htmlFor="time">Uhrzeit:</label>
          <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Termin aktualisieren' : 'Termin hinzufügen'}
          </button>
          {isEditing && <button type="button" className="btn btn-secondary" onClick={handleCancel}>Abbrechen</button>}
        </div>
      </form>
    </div>
  );
});

export default AppointmentForm;