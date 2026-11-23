import React, { useState, useEffect } from 'react';
import { store } from '../store';
import { useActions } from '../actions';
import { CareProvider, Appointment } from './types';
import { UserCheck, Calendar, Clock, Video, MapPin, Plus, Check } from '../ui/icons';
import { Button, Modal, Badge } from '../ui/kit';

export const CarePage: React.FC = () => {
  const [state, setState] = useState(store.getState());
  const { notify } = useActions();

  const [selectedProvider, setSelectedProvider] = useState<CareProvider | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<'In-Person' | 'Video Call'>('In-Person');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  useEffect(() => {
    const unsub = store.subscribe(() => setState(store.getState()));
    return unsub;
  }, []);

  const openBookModal = (provider: CareProvider) => {
    setSelectedProvider(provider);
    setSelectedSlot(provider.slots[0] || '10:00 AM');
    const d = new Date();
    d.setDate(d.getDate() + 5);
    setSelectedDate(d.toISOString().split('T')[0]);
    setIsBookModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedProvider || !selectedDate || !selectedSlot) return;

    store.bookAppointment(
      {
        providerId: selectedProvider.id,
        providerName: selectedProvider.name,
        specialty: selectedProvider.specialty,
        date: selectedDate,
        time: selectedSlot,
        type: appointmentType,
        status: 'Upcoming',
      },
      notify
    );

    setIsBookModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink-950)' }}>Care Team & Appointments</h1>
        <p style={{ color: 'var(--ink-500)', fontSize: '0.9375rem' }}>
          Schedule consultations, book open slots with specialists, and manage visits.
        </p>
      </div>

      {/* Upcoming Appointments */}
      <div className="card-section">
        <h2 className="section-title">
          <Calendar size={18} color="var(--lime-600)" />
          Scheduled Appointments
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {state.appointments.map((apt) => (
            <div
              key={apt.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink-900)' }}>
                  {apt.providerName}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--ink-500)' }}>
                  {apt.specialty} • {apt.type}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--lime-600)', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  {apt.date} at {apt.time}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Badge variant={apt.status === 'Upcoming' ? 'lime' : 'neutral'}>
                  {apt.status}
                </Badge>
                {apt.status === 'Upcoming' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => store.cancelAppointment(apt.id, notify)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Care Providers Directory */}
      <div>
        <h2 className="section-title" style={{ marginBottom: '1rem' }}>
          <UserCheck size={18} color="var(--lime-600)" />
          Your Primary Care Team
        </h2>

        <div className="care-grid">
          {state.providers.map((p) => (
            <div key={p.id} className="provider-card">
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--ink-950)' }}>
                  {p.name}
                </h3>
                <div style={{ fontSize: '0.8125rem', color: 'var(--lime-600)', fontWeight: 600 }}>
                  {p.specialty}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--ink-500)', marginTop: '4px' }}>
                  {p.clinic}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-600)' }}>
                  Available Open Slots:
                </div>
                <div className="slot-picker-grid">
                  {p.slots.map((s, idx) => (
                    <div key={idx} className="slot-btn" onClick={() => openBookModal(p)}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="secondary" size="sm" onClick={() => openBookModal(p)}>
                <Calendar size={14} /> Book Consultation
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title={selectedProvider ? `Book with ${selectedProvider.name}` : 'Book Appointment'}
      >
        {selectedProvider && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink-700)' }}>Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginTop: '4px',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink-700)' }}>Available Time Slot</label>
              <div className="slot-picker-grid" style={{ marginTop: '6px' }}>
                {selectedProvider.slots.map((slot) => (
                  <button
                    key={slot}
                    className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink-700)' }}>Appointment Mode</label>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '6px' }}>
                <Button
                  size="sm"
                  variant={appointmentType === 'In-Person' ? 'secondary' : 'outline'}
                  onClick={() => setAppointmentType('In-Person')}
                >
                  <MapPin size={14} /> In-Person
                </Button>
                <Button
                  size="sm"
                  variant={appointmentType === 'Video Call' ? 'secondary' : 'outline'}
                  onClick={() => setAppointmentType('Video Call')}
                >
                  <Video size={14} /> Video Call
                </Button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="outline" onClick={() => setIsBookModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={handleConfirmBooking}>
                Confirm Appointment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
