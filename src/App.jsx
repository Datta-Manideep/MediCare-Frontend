
import { useEffect, useState } from 'react'
import './App.css'

const doctors = [
  { id: 1, name: 'Dr. Arun Kumar', specialty: 'General Physician', emoji: '👨‍⚕️' },
  { id: 2, name: 'Dr. Priya Sharma', specialty: 'Cardiologist', emoji: '👩‍⚕️' },
  { id: 3, name: 'Dr. Rahul Reddy', specialty: 'Dermatologist', emoji: '👨‍⚕️' },
  { id: 4, name: 'Dr. Ananya Rao', specialty: 'Pediatrician', emoji: '👩‍⚕️' },
  { id: 5, name: 'Dr. Kiran Kumar', specialty: 'General Physician', emoji: '👨‍⚕️' },
]

function App() {
  const [assistantQuestion, setAssistantQuestion] = useState('')
  const [assistantReply, setAssistantReply] = useState('')
  const [backendMessage, setBackendMessage] = useState('Connecting...')
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('All')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('10:00 AM')
  const [patientName, setPatientName] = useState('')
  const [message, setMessage] = useState('')
  const [appointments, setAppointments] = useState([])

// Reload saved appointments from MySQL whenever MediCare opens
  useEffect(() => {
    let cancelled = false;

    async function loadSavedAppointments() {
      try {
        const response = await fetch('http://localhost:8080/api/appointments');

        if (!response.ok) {
          throw new Error('Server returned status ' + response.status);
        }

        const savedAppointments = await response.json();

        if (!cancelled && Array.isArray(savedAppointments)) {
          setAppointments(savedAppointments);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Could not reload saved appointments:', error);
          setMessage('Could not load saved appointments. Check that the backend is running.');
        }
      }
    }

    loadSavedAppointments();

    return () => {
      cancelled = true;
    };
  }, []);

  // Connect React to the Spring Boot backend
  useEffect(() => {
    fetch('http://localhost:8080/api/hello')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Backend request failed')
        }
        return response.text()
      })
      .then((text) => setBackendMessage(text))
      .catch(() => setBackendMessage('Backend connection failed'))
  }, [])

  // Search and filter doctors
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(search.toLowerCase())

    const matchesSpecialty =
      specialty === 'All' || doctor.specialty === specialty

    return matchesSearch && matchesSpecialty
  })

  // Book an appointment
  async function bookAppointment(event) {
  event.preventDefault();

  if (!selectedDoctor || !patientName.trim() || !date || !time) {
    setMessage("Please complete all booking details.");
    return;
  }

  const appointment = {
    doctor: selectedDoctor.name,
    specialty: selectedDoctor.specialty,
    patient: patientName.trim(),
    date,
    time,
  };

  setMessage("Saving appointment...");

  try {
    const response = await fetch("http://localhost:8080/api/appointments", {
      method: "POST",
        credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointment),
    });

    if (!response.ok) {
      throw new Error("Server rejected the appointment: " + response.status);
    }

    const savedAppointment = await response.json();

    if (!savedAppointment.id) {
      throw new Error("The server did not return an appointment ID.");
    }

    setAppointments((previous) => [...previous, savedAppointment]);
    setMessage("Appointment booked successfully! Booking ID: " + savedAppointment.id);
    setSelectedDoctor(null);
    setPatientName("");
    setDate("");
    setTime("10:00 AM");
  } catch (error) {
    setMessage("Booking failed: " + error.message);
  }
}


  function handleAssistantSubmit(event) {
    event.preventDefault()
    const question = assistantQuestion.trim().toLowerCase()

    if (!question) {
      setAssistantReply('Please enter a question first.')
    } else if (question.includes('book') || question.includes('appointment') || question.includes('schedule')) {
      setAssistantReply('To book an appointment, choose a doctor, enter your name, select a date and time, then click Confirm Appointment.')
    } else if (question.includes('doctor') || question.includes('special') || question.includes('cardiologist') || question.includes('dermatologist')) {
      setAssistantReply('Open Find Doctors to search by doctor name or specialty.')
    } else if (question.includes('record') || question.includes('history') || question.includes('cancel')) {
      setAssistantReply('Open My Appointments to view your bookings. Use Cancel beside an appointment to cancel it.')
    } else {
      setAssistantReply('I can help you find doctors, book appointments, and view your appointment history. I cannot diagnose medical conditions.')
    }
  }
  return (
    <div className="app">

      {/* Backend connection status */}
      <div
        style={{
          textAlign: 'center',
          padding: '12px',
          background: '#e8f7f4',
          color: '#174c45',
          fontWeight: 600,
        }}
      >
        Backend status: {backendMessage}
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <h2 className="logo">✚ MediCare</h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#doctors">Doctors</a>
          <a href="#appointments">My Appointments</a>
        </div>

        <button
          className="login-btn"
          onClick={() =>
            document.getElementById('booking')?.scrollIntoView({
              behavior: 'smooth',
            })
          }
        >
          Book Now
        </button>
      </nav>

      {/* Home section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="tag">YOUR HEALTH, OUR PRIORITY</p>

          <h1>
            Healthcare Made <span>Simple.</span>
          </h1>

          <p className="description">
            Find doctors, book appointments, and manage your
            healthcare journey in one convenient place.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() =>
                document.getElementById('doctors')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }
            >
              Find a Doctor →
            </button>

            <button
              className="secondary-btn"
              onClick={() =>
                document.getElementById('services')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }
            >
              Explore Services
            </button>
          </div>

          <div className="trust">
            <div>
              <strong>24/7</strong>
              <p>Online Access</p>
            </div>
            <div>
              <strong>Easy</strong>
              <p>Booking</p>
            </div>
            <div>
              <strong>Secure</strong>
              <p>Patient Records</p>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <div className="medical-icon">✚</div>
          <h2>Your Health Matters</h2>
          <p>Better care starts with the right connection.</p>

          <div className="appointment-preview">
            <span>♡</span>
            <div>
              <strong>Smart Healthcare</strong>
              <p>Care for your needs</p>
            </div>
          </div>

          <div className="appointment-preview">
            <span>✓</span>
            <div>
              <strong>Easy Appointments</strong>
              <p>Plan your visit easily</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services section */}
      <section className="services" id="services">
  <p className="tag">WHAT WE OFFER</p>
  <h2>Healthcare at Your Fingertips</h2>
  <p className="section-description">
    Everything you need to manage your healthcare in one place.
  </p>

  <div className="service-grid">
    <button
      type="button"
      className="service-card service-card-button"
      onClick={() => document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
    >
      <span className="service-icon">🩺</span>
      <h3>Find Doctors</h3>
      <p>Search doctors by specialization.</p>
      <span className="service-action">Explore doctors →</span>
    </button>

    <button
      type="button"
      className="service-card service-card-button"
      onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
    >
      <span className="service-icon">📅</span>
      <h3>Book Appointments</h3>
      <p>Select a convenient date and time.</p>
      <span className="service-action">Book now →</span>
    </button>

    <button
      type="button"
      className="service-card service-card-button"
      onClick={() => document.getElementById('appointments')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
    >
      <span className="service-icon">📋</span>
      <h3>Medical Records</h3>
      <p>View your appointment history.</p>
      <span className="service-action">View records →</span>
    </button>

    <a
      className="service-card" href="#assistant"
    >
      <span className="service-icon">🤖</span>
      <h3>AI Assistant</h3>
      <p>Get basic guidance on using MediCare.</p>
      <span className="service-action">Ask a question →</span>
    </a>
  </div>
</section>
<section className="doctors" id="doctors">
        <p className="tag">OUR SPECIALISTS</p>
        <h2>Find the Right Doctor</h2>

        <p className="section-description">
          Search and select a doctor for your appointment.
        </p>

        <div className="doctor-filters">
          <input
            type="text"
            placeholder="Search doctor or specialization..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
          >
            <option value="All">All Specializations</option>
            <option value="General Physician">General Physician</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatrician">Pediatrician</option>
          </select>
        </div>

        <div className="doctor-grid">
          {filteredDoctors.map((doctor) => (
            <article className="doctor-card" key={doctor.id}>
              <div className="doctor-avatar">{doctor.emoji}</div>
              <h3>{doctor.name}</h3>
              <p>{doctor.specialty}</p>
              <span>Sample Profile</span>

              <button
                className="primary-btn doctor-book-btn"
                onClick={() => {
                  setSelectedDoctor(doctor)
                  setMessage('')
                  document.getElementById('booking')?.scrollIntoView({
                    behavior: 'smooth',
                  })
                }}
              >
                Book Appointment
              </button>
            </article>
          ))}

          {filteredDoctors.length === 0 && (
            <p>No matching doctors found. Try another search.</p>
          )}
        </div>
      </section>

      {/* Appointment booking section */}
      <section className="booking-section" id="booking">
        <p className="tag">ONLINE BOOKING</p>
        <h2>Book Your Appointment</h2>

        <p className="section-description">
          Enter your details to create a sample appointment.
        </p>

        <form className="booking-form" onSubmit={bookAppointment}>
          <label htmlFor="patientName">Patient Name</label>
          <input
            id="patientName"
            type="text"
            placeholder="Enter your full name"
            value={patientName}
            onChange={(event) => setPatientName(event.target.value)}
            required
          />

          <label htmlFor="selectedDoctor">Selected Doctor</label>
          <select
            id="selectedDoctor"
            value={selectedDoctor?.id || ''}
            onChange={(event) => {
              const doctor = doctors.find(
                (item) => item.id === Number(event.target.value),
              )
              setSelectedDoctor(doctor || null)
            }}
            required
          >
            <option value="">Choose a doctor</option>

            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} — {doctor.specialty}
              </option>
            ))}
          </select>

          <label htmlFor="appointmentDate">Appointment Date</label>
          <input
            id="appointmentDate"
            type="date"
            value={date}
            min={new Date().toLocaleDateString('en-CA')}
            onChange={(event) => setDate(event.target.value)}
            required
          />

          <label htmlFor="appointmentTime">Available Time</label>
          <select
            id="appointmentTime"
            value={time}
            onChange={(event) => setTime(event.target.value)}
          >
            <option>10:00 AM</option>
            <option>11:00 AM</option>
            <option>12:00 PM</option>
            <option>02:00 PM</option>
            <option>03:00 PM</option>
            <option>04:00 PM</option>
          </select>

          <button className="primary-btn submit-btn" type="submit">
            Confirm Appointment
          </button>

          {message && (
            <p className="booking-message" role="status">
              {message}
            </p>
          )}
        </form>
      </section>

      {/* My appointments section */}
      <section className="appointments-section" id="appointments">
        <p className="tag">YOUR BOOKINGS</p>
        <h2>My Appointments</h2>

        {appointments.length === 0 ? (
          <p className="section-description">
            Your appointments will appear here after booking.
          </p>
        ) : (
          <div className="saved-appointments">
            {appointments.map((appointment) => (
              <article
                className="saved-appointment"
                key={appointment.id}
              >
                <div>
                  <h3>{appointment.doctor}</h3>
                  <p>{appointment.specialty}</p>
                  <p>Patient: {appointment.patient}</p>
                  <p>
                    Date: {appointment.date} · Time: {appointment.time}
                  </p>
                </div>

                <button
                  className="cancel-btn"
                  onClick={() => {
                    setAppointments((previous) =>
                      previous.filter(
                        (item) => item.id !== appointment.id,
                      ),
                    )
                    setMessage('Appointment cancelled.')
                  }}
                >
                  Cancel
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <section className="booking-section assistant-section" id="assistant">
  <p className="tag">MEDICARE HELP</p>
  <h2>AI Assistant</h2>
  <p className="section-description">
    Ask how to find doctors, book appointments, or view your appointment history.
  </p>

  <form className="booking-form" onSubmit={handleAssistantSubmit}>
    <label htmlFor="assistantQuestion">Your question</label>
    <input
      id="assistantQuestion"
      type="text"
      placeholder="Example: How do I book an appointment?"
      value={assistantQuestion}
      onChange={(event) => setAssistantQuestion(event.target.value)}
    />
    <button className="primary-btn submit-btn" type="submit">
      Ask Assistant
    </button>
    {assistantReply && (
      <p className="booking-message" role="status">{assistantReply}</p>
    )}
  </form>

  <p className="section-description">
    Demo assistant: provides basic website guidance, not medical diagnosis.
  </p>
</section>
<footer>
        <h2>✚ MediCare</h2>
        <p>Smart Healthcare Appointment &amp; Patient Management System</p>
        <p>Academic project demonstration — sample data only.</p>
      </footer>
    </div>
  )
}

export default App
