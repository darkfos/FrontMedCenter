import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Phone, 
  Video, 
  Check, 
  MapPin, 
  ChevronRight,
  Cross,
  Shield,
  Award,
  Star,
  Users,
  Activity,
  Loader2,
  User
} from 'lucide-react';
import './ConsultationsPage.css';
import { DoctorAPI } from '../../api/doctor';
import { getAvailableSlots, createAppointment } from '../../api/appointments';
import { useInfoModal } from '../../context/InfoModalContext';
import { useAuth } from '../../context/AuthContext';

/** По formatWork определяем, поддерживает ли врач очную и/или онлайн консультацию */
function getConsultationTypes(formatWork) {
  if (!formatWork) return ['in-person', 'online'];
  const f = String(formatWork).toLowerCase();
  if (f === 'och') return ['in-person'];
  if (f === 'zoch') return ['online'];
  return ['in-person', 'online']; // other
}

const ConsultationsPage = () => {
  const { openInfo } = useInfoModal();
  const { currentUser } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState('in-person');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    symptoms: ''
  });
  const [availableSlots, setAvailableSlots] = useState({ available: [] });
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingSubmitError, setBookingSubmitError] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    setDoctorsLoading(true);
    DoctorAPI.getFilteredDoctors(undefined, undefined, undefined, 200)
      .then((list) => setDoctors(Array.isArray(list) ? list : []))
      .catch(() => setDoctors([]))
      .finally(() => setDoctorsLoading(false));
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((d) => {
      if (currentUser?.type === 'doctor' && Number(d.id) === Number(currentUser?.id)) return false;
      const types = getConsultationTypes(d.formatWork);
      return types.includes(consultationType);
    });
  }, [doctors, consultationType, currentUser?.type, currentUser?.id]);

  useEffect(() => {
    if (!selectedDoctor?.id || !isBookingModalOpen) return;
    setSlotsLoading(true);
    setAvailableSlots({ available: [] });
    const today = new Date();
    const from = today.toISOString().slice(0, 10);
    const toDate = new Date(today);
    toDate.setDate(toDate.getDate() + 28);
    const to = toDate.toISOString().slice(0, 10);
    getAvailableSlots(selectedDoctor.id, from, to)
      .then((data) => setAvailableSlots(data ?? { available: [] }))
      .catch(() => setAvailableSlots({ available: [] }))
      .finally(() => setSlotsLoading(false));
  }, [selectedDoctor?.id, isBookingModalOpen]);

  const consultationTypes = [
    {
      id: 'in-person',
      title: 'Очная консультация',
      description: 'Личный прием в медицинском центре',
      price: 'от 3 500 ₽',
      icon: MapPin,
      features: [
        'Личный осмотр врача',
        'Лабораторные исследования',
        'Современное оборудование',
        'Индивидуальный подход'
      ]
    },
    {
      id: 'online',
      title: 'Онлайн консультация',
      description: 'Консультация по видеосвязи',
      price: 'от 2 800 ₽',
      icon: Video,
      features: [
        'Консультация из дома',
        'Запись консультации',
        'Электронные рецепты',
        'Последующее наблюдение'
      ]
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Конфиденциальность',
      description: 'Все данные защищены по стандарту HIPAA'
    },
    {
      icon: Users,
      title: 'Опытные специалисты',
      description: 'Врачи с опытом работы от 8 лет'
    },
    {
      icon: Activity,
      title: 'Современное оборудование',
      description: 'Диагностика на современном оборудовании'
    },
    {
      icon: Award,
      title: 'Гарантия качества',
      description: 'Сертифицированные медицинские услуги'
    }
  ];

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate('');
    setSelectedTime('');
    setBookingStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setBookingStep(3);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setBookingStep(4);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (bookingStep !== 4 || !selectedDoctor?.id || !selectedDate || !selectedTime) return;
    setBookingSubmitError('');
    setBookingSubmitting(true);
    createAppointment({
      doctorId: selectedDoctor.id,
      dateVisit: selectedDate,
      time: selectedTime,
    })
      .then(() => {
        const doctorName = selectedDoctor.fullName ?? selectedDoctor.name ?? 'Врач';
        openInfo({
          title: 'Запись оформлена',
          message: `Запись успешно оформлена!\nВрач: ${doctorName}\nДата: ${selectedDate}\nВремя: ${selectedTime}\nТип: ${consultationType === 'in-person' ? 'Очная' : 'Онлайн'}\nМы свяжемся с вами для подтверждения.`,
          variant: 'success',
        });
        setIsBookingModalOpen(false);
        resetBooking();
      })
      .catch((err) => {
        const msg = err?.response?.data?.message ?? (err?.response?.status === 401 ? 'Войдите в аккаунт, чтобы записаться на приём' : 'Не удалось создать запись');
        setBookingSubmitError(msg);
      })
      .finally(() => setBookingSubmitting(false));
  };

  const resetBooking = () => {
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setBookingStep(1);
    setAvailableSlots({ available: [] });
    setBookingSubmitError('');
    setFormData({
      name: '',
      phone: '',
      email: '',
      symptoms: ''
    });
  };

  const availableDates = availableSlots?.available ?? [];
  const availableTimesForDate = selectedDate
    ? (availableDates.find((a) => a.date === selectedDate)?.slots ?? [])
    : [];

  const startBooking = () => {
    setIsBookingModalOpen(true);
    resetBooking();
  };

  return (
    <div className="consultations-page">
      <section className="consultations-hero">
        <div className="consultations-container">
          <div className="consultations-header">
            <div className="consultations-tag">
              <div className="consultations-tag-dot"></div>
              ЗАПИСЬ НА КОНСУЛЬТАЦИЮ
            </div>
            <h1 className="consultations-title">
              Запись на прием к врачу 
            </h1>
            <p className="consultations-description">
              Запишитесь на очную или онлайн консультацию с ведущими специалистами. 
              Быстрая запись, удобное время и профессиональная помощь.
            </p>
            <button className="consultations-hero-button" onClick={startBooking}>
              Записаться на прием
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      <section className="consultations-benefits">
        <div className="consultations-container">
          <div className="consultations-section-header">
            <h2>Почему выбирают MediCare</h2>
            <p>Наши преимущества для вашего здоровья</p>
          </div>
          
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">
                  <benefit.icon size={32} />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="consultation-types-section">
        <div className="consultations-container">
          <div className="consultations-section-header">
            <h2>Форматы консультаций</h2>
            <p>Выберите удобный способ получения медицинской помощи</p>
          </div>

          <div className="types-grid">
            {consultationTypes.map((type) => (
              <div 
                key={type.id}
                className={`type-card ${consultationType === type.id ? 'selected' : ''}`}
                onClick={() => setConsultationType(type.id)}
              >
                <div className="type-header">
                  <div className="type-icon">
                    <type.icon size={32} />
                  </div>
                  <div className="type-info">
                    <h3>{type.title}</h3>
                    <p>{type.description}</p>
                  </div>
                </div>
                
                <ul className="type-features">
                  {type.features.map((feature, index) => (
                    <li key={index}>
                      <Check size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="type-price">
                  <span>{type.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="consultations-doctors">
        <div className="consultations-container">
          <div className="consultations-section-header">
            <h2>Наши специалисты</h2>
            <p>
              {consultationType === 'in-person'
                ? 'Врачи, доступные для очной консультации'
                : 'Врачи, доступные для онлайн консультации'}
            </p>
          </div>

          {doctorsLoading ? (
            <div className="consultations-doctors-loading">
              <Loader2 size={40} className="consultations-spinner" />
              <p>Загрузка списка врачей...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="consultations-doctors-empty">
              <User size={48} />
              <p>По выбранному формату консультации врачи не найдены</p>
              <p className="consultations-doctors-empty-hint">
                Попробуйте выбрать другой тип консультации выше
              </p>
            </div>
          ) : (
            <div className="doctors-grid">
              {filteredDoctors.map((doctor) => {
                const consultationTypes = getConsultationTypes(doctor.formatWork);
                return (
                  <div key={doctor.id} className="doctor-card">
                    <div className="doctor-header">
                      <div className="doctor-avatar">
                        <User size={24} color="white" />
                      </div>
                      <div className="doctor-info">
                        <h3>{doctor.fullName}</h3>
                        <p className="doctor-specialty">{doctor.clinicType?.name ?? doctor.position ?? '—'}</p>
                      </div>
                    </div>
                    
                    <div className="doctor-rating">
                      <Star size={16} />
                      <span>{Number(doctor.rating) ?? '—'}</span>
                      <span className="reviews">({(doctor.doctorReviews || []).length} отзывов)</span>
                    </div>
                    
                    <p className="doctor-description">{doctor.description || doctor.position || ''}</p>
                    
                    <div className="doctor-details">
                      <div className="doctor-experience">
                        <Clock size={14} />
                        <span>{doctor.experience ?? 0} лет опыта</span>
                      </div>
                      {(doctor.education || doctor.studyBuild) && (
                        <div className="doctor-education">
                          <Award size={14} />
                          <span>{doctor.education || doctor.studyBuild}</span>
                        </div>
                      )}
                    </div>

                    <div className="doctor-consultation-types">
                      {consultationTypes.map((type, index) => (
                        <span
                          key={index}
                          className={`consultation-type-badge ${type}`}
                        >
                          {type === 'in-person' ? 'Очно' : 'Онлайн'}
                        </span>
                      ))}
                    </div>

                    <div className="doctor-card-actions">
                      <Link to={`/doctors/${doctor.id}`} className="doctor-link-button">
                        Подробнее
                        <ChevronRight size={16} />
                      </Link>
                      <button
                        className="doctor-book-button"
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setIsBookingModalOpen(true);
                        }}
                      >
                        <Calendar size={16} />
                        <span>Записаться на прием</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {isBookingModalOpen && (
        <div className="booking-modal-overlay" onClick={() => setIsBookingModalOpen(false)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Запись на прием</h2>
              <button className="modal-close" onClick={() => setIsBookingModalOpen(false)}>
                <Cross size={24} />
              </button>
            </div>

            <div className="modal-steps">
              <div className={`step ${bookingStep >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <span>Выбор врача</span>
              </div>
              <div className={`step ${bookingStep >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <span>Дата</span>
              </div>
              <div className={`step ${bookingStep >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <span>Время</span>
              </div>
              <div className={`step ${bookingStep >= 4 ? 'active' : ''}`}>
                <div className="step-number">4</div>
                <span>Данные</span>
              </div>
            </div>

            <div className="modal-content">
              {bookingStep === 1 && (
                <div className="step-content">
                  <h3>Выберите специалиста</h3>
                  <div className="doctors-select">
                    {filteredDoctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        className={`doctor-select-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                        onClick={() => handleDoctorSelect(doctor)}
                      >
                        <div className="select-avatar">
                          <User size={20} color="white" />
                        </div>
                        <div className="select-info">
                          <h4>{doctor.fullName}</h4>
                          <p>{doctor.clinicType?.name ?? doctor.position ?? '—'}</p>
                          <div className="select-rating">
                            <Star size={12} />
                            <span>{Number(doctor.rating) ?? '—'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {bookingStep === 2 && selectedDoctor && (
                <div className="step-content">
                  <h3>Выберите дату</h3>
                  <p className="step-content-subtitle">{selectedDoctor.fullName} — доступные дни</p>
                  {slotsLoading ? (
                    <div className="step-slots-loading">
                      <Loader2 size={24} className="consultations-spinner" />
                      <span>Загрузка доступных дат...</span>
                    </div>
                  ) : availableDates.length === 0 ? (
                    <p className="step-no-slots">Нет доступных дат на ближайшие 4 недели</p>
                  ) : (
                    <div className="dates-select">
                      {availableDates.map((a) => (
                        <button
                          key={a.date}
                          type="button"
                          className={`date-button ${selectedDate === a.date ? 'selected' : ''}`}
                          onClick={() => handleDateSelect(a.date)}
                        >
                          {new Date(a.date + 'T12:00:00').toLocaleDateString('ru-RU', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {bookingStep === 3 && selectedDoctor && selectedDate && (
                <div className="step-content">
                  <h3>Выберите время</h3>
                  <p className="step-content-subtitle">{selectedDate}</p>
                  {slotsLoading ? (
                    <div className="step-slots-loading">
                      <Loader2 size={24} className="consultations-spinner" />
                      <span>Загрузка слотов...</span>
                    </div>
                  ) : availableTimesForDate.length === 0 ? (
                    <p className="step-no-slots">Нет доступного времени на эту дату</p>
                  ) : (
                    <div className="times-select">
                      {availableTimesForDate.map((time) => (
                        <button
                          key={time}
                          type="button"
                          className={`time-button ${selectedTime === time ? 'selected' : ''}`}
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {bookingStep === 4 && (
                <div className="step-content">
                  <h3>Ваши данные</h3>
                  <form onSubmit={handleSubmitBooking}>
                    {bookingSubmitError && (
                      <p className="booking-submit-error">{bookingSubmitError}</p>
                    )}
                    <div className="form-group">
                      <label>Имя и фамилия *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        placeholder="Введите ваше имя"
                      />
                    </div>
                    <div className="form-group">
                      <label>Телефон *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        required
                        placeholder="+7 (___) ___-__-__"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="form-group">
                      <label>Симптомы или причина обращения</label>
                      <textarea
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleFormChange}
                        rows="3"
                        placeholder="Опишите ваши симптомы..."
                      />
                    </div>
                    
                    <div className="booking-summary">
                      <h4>Детали записи:</h4>
                      <p><strong>Врач:</strong> {selectedDoctor?.fullName ?? selectedDoctor?.name}</p>
                      <p><strong>Дата:</strong> {selectedDate}</p>
                      <p><strong>Время:</strong> {selectedTime}</p>
                      <p><strong>Тип:</strong> {consultationType === 'in-person' ? 'Очная консультация' : 'Онлайн консультация'}</p>
                    </div>
                    
                    <button
                      type="submit"
                      className="submit-booking-button"
                      disabled={bookingSubmitting}
                    >
                      {bookingSubmitting ? 'Отправка...' : 'Подтвердить запись'}
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {bookingStep > 1 && (
                <button 
                  className="modal-back-button"
                  onClick={() => setBookingStep(bookingStep - 1)}
                >
                  Назад
                </button>
              )}
              {bookingStep < 4 && (
                <button 
                  className="modal-next-button"
                  onClick={() => {
                    if (bookingStep === 1 && !selectedDoctor) {
                      openInfo({ title: 'Выбор врача', message: 'Пожалуйста, выберите врача', variant: 'info' });
                      return;
                    }
                    if (bookingStep === 2 && !selectedDate) {
                      openInfo({ title: 'Выбор даты', message: 'Пожалуйста, выберите дату', variant: 'info' });
                      return;
                    }
                    if (bookingStep === 3 && !selectedTime) {
                      openInfo({ title: 'Выбор времени', message: 'Пожалуйста, выберите время', variant: 'info' });
                      return;
                    }
                    setBookingStep(bookingStep + 1);
                  }}
                >
                  Далее
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <section className="consultations-cta">
        <div className="consultations-container">
          <div className="cta-content">
            <h2>Есть вопросы?</h2>
            <p>Свяжитесь с нами для получения дополнительной информации</p>
            <div className="cta-buttons">
              <Link to="/contacts" className="cta-button secondary">
                <Phone size={18} />
                <span>Контакты</span>
              </Link>
              <button className="cta-button primary" onClick={startBooking}>
                <Calendar size={18} />
                <span>Записаться онлайн</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConsultationsPage;