import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import './App.css';
import { doctors, specialties, cities } from './doctors';

function App() {
  // Lade Termine aus dem localStorage oder starte mit einem leeren Array
  const [appointments, setAppointments] = useState(() => {
    const savedAppointments = localStorage.getItem('appointments');
    return savedAppointments ? JSON.parse(savedAppointments) : [];
  });

  const [editingAppointment, setEditingAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorFilter, setDoctorFilter] = useState(''); // Neuer State für den Arztfilter
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const APPOINTMENTS_PER_PAGE = 6; // 6 Termine pro Seite

  // Helfer-Komponente, um die Termin-ID aus der URL zu lesen
  const AppointmentLoader = () => {
    const { terminId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
      if (terminId) {
        const appointmentToEdit = appointments.find(app => app.id === terminId);
        if (appointmentToEdit) {
          setEditingAppointment(appointmentToEdit);
        } else {
          // Optional: Wenn der Termin nicht gefunden wird, zur Hauptseite navigieren
          alert('Termin nicht gefunden.');
          navigate('/');
        }
      }
    }, [terminId, navigate]);

    return null; // Diese Komponente rendert keine eigene UI
  };

  // Speichere Termine im localStorage, wenn sie sich ändern
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = useCallback((appointment) => {
    setAppointments(prev => [...prev, { ...appointment, id: uuidv4() }]);
    setConfirmationMessage('Termin erfolgreich hinzugefügt!');
  }, []);

  const updateAppointment = useCallback((id, updatedAppointment) => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === id ? { ...app, ...updatedAppointment, id } : app
      )
    );
    setConfirmationMessage('Termin erfolgreich aktualisiert!');
  }, []);

  // Effekt zum Ausblenden der Bestätigungsnachricht nach 3 Sekunden
  useEffect(() => {
    if (confirmationMessage) {
      const timer = setTimeout(() => {
        setConfirmationMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmationMessage]);

  const deleteAppointment = useCallback((id) => {
    setAppointments((prevAppointments) =>
      prevAppointments.filter((appointment) => appointment.id !== id)
    );
  }, []);

  const filteredAndSortedAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => {
        // 1. Nach Arzt filtern, falls ausgewählt
        if (!doctorFilter) return true;
        return appointment.doctor.name === doctorFilter;
      })
      .filter((appointment) => {
        // Schutzprüfung, um den Laufzeitfehler zu verhindern
        if (!appointment.patientName) return false;
        // 2. Allgemeine Suche (Patientenname)
        const patient = appointment.patientName.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        // Die Arztsuche ist nun separat, daher hier nur nach Patient suchen
        return patient.includes(search);
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        if (sortOrder === 'asc') {
          return dateA - dateB;
        }
        return dateB - dateA;
      });
  }, [appointments, searchTerm, sortOrder, doctorFilter]);

  // Effekt, der die Seite auf 1 zurücksetzt, wenn Filter geändert werden
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, doctorFilter, sortOrder]);

  // Berechne die Gesamtanzahl der Seiten
  const totalPages = Math.ceil(filteredAndSortedAppointments.length / APPOINTMENTS_PER_PAGE);

  // Schneide die Termine für die aktuelle Seite aus
  const displayedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * APPOINTMENTS_PER_PAGE;
    const endIndex = startIndex + APPOINTMENTS_PER_PAGE;
    return filteredAndSortedAppointments.slice(startIndex, endIndex);
  }, [filteredAndSortedAppointments, currentPage]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Arzttermin-Verwaltung</h1>
      </header>
      <Routes>
        <Route path="/" element={
          <div className="container">
            <main className="dashboard-layout">
              <div className="dashboard-form-panel">
                <AppointmentForm
                  editingAppointment={editingAppointment}
                  setEditingAppointment={setEditingAppointment}
                  addAppointment={addAppointment}
                  updateAppointment={updateAppointment}
                  doctors={doctors}
                  specialties={specialties}
                  cities={cities}
                />
              </div>
              <div className="dashboard-list-panel">
                <AppointmentList
                  appointments={displayedAppointments}
                  deleteAppointment={deleteAppointment}
                  setEditingAppointment={setEditingAppointment}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  doctorFilter={doctorFilter}
                  setDoctorFilter={setDoctorFilter}
                  doctors={doctors}
                  confirmationMessage={confirmationMessage}
                  setConfirmationMessage={setConfirmationMessage}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </main>
          </div>
        }>
          {/* Verschachtelte Route, um die ID aus der URL zu lesen */}
          <Route path="termin/:terminId" element={<AppointmentLoader />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
