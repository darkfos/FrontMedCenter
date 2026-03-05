import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Stethoscope,
  Heart,
  Brain,
  Bone,
  Eye,
  Scissors,
  Baby,
  Pill,
  Calendar,
  Clock,
  Check,
  ChevronRight,
  Search,
  Cross,
  Shield,
  Users,
  Award,
  Star,
  Sparkles,
  User,
  Loader2,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { ClinicAPI } from "../../api/clinic";
import { getAvailableSlots, createAppointment } from '../../api/appointments';
import { debounce } from "../../utils/debounce";
import { useInfoModal } from '../../context/InfoModalContext';
import { useAuth } from '../../context/AuthContext';
import './ServicesPage.css';

const ServicesPage = () => {
  const navigate = useNavigate();
  const { openInfo } = useInfoModal();
  const { currentUser } = useAuth();
  const [clinicCategories, setClinicCategories] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Запись на услугу: шаги 1 — врач, 2 — дата, 3 — время
  const [bookingStep, setBookingStep] = useState(0);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState({ available: [] });
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const fetchServices = useMemo(() => {
      return debounce(async (...args) => {
        const data = await ClinicAPI.filteredServices(...args);
        setServices(data);
      }, 800);
  }, [debounce]);

  const fetchClinicCategories = useMemo(() => {
      return debounce(async (...args) => {
        const data = await ClinicAPI.allClinicTypes(...args);
        setClinicCategories(data);
      }, 500);
  }, [debounce]);


  const serviceCategoryIcon = useCallback((iconName) => {
    const icons = {
      'all': [<Stethoscope size={20} />, '#10b981'],
      'therapy': [<Heart size={20} />, '#ef4444'],
      'neurology': [<Brain size={20} />, '#8b5cf6'],
      'orthopedics': [<Bone size={20} />, '#f59e0b'],
      'ophthalmology': [<Eye size={20} />, '#0ea5e9'],
      'dentistry': [<Scissors size={20} />, '#06b6d4'],
      'pediatrics': [<Baby size={20} />, '#ec4899'],
      'diagnostics': [<Pill size={20} />, '#84cc16']
    };

    return icons[iconName];
  }, [clinicCategories]);

  const allServices = useMemo(() => {
    let cntService = 0;

    Object.keys(clinicCategories).forEach(category => {
      cntService += clinicCategories[category].servicesCnt
    });

    return cntService;
  }, [clinicCategories]);

  const benefits = [
    {
      icon: Shield,
      title: 'Безопасность',
      description: 'Все процедуры выполняются по медицинским стандартам'
    },
    {
      icon: Users,
      title: 'Опытные врачи',
      description: 'Специалисты с опытом работы от 10 лет'
    },
    {
      icon: Award,
      title: 'Качество услуг',
      description: 'Сертифицированное оборудование и материалы'
    },
    {
      icon: Clock,
      title: 'Без очередей',
      description: 'Запись на удобное время и быстрое обслуживание'
    }
  ];

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setBookingStep(0);
    setBookingDoctor(null);
    setBookingDate('');
    setBookingTime('');
    setBookingError('');
  };

  const serviceDoctors = (selectedService?.doctors ?? []).filter(
    (d) => currentUser?.type !== 'doctor' || Number(d.id) !== Number(currentUser?.id)
  );
  const availableDates = availableSlots?.available ?? [];
  const dayData = bookingDate ? availableDates.find((a) => a.date === bookingDate) : null;
  const freeSlotsForDate = dayData?.slots ?? [];
  const bookedSlotsForDate = dayData?.bookedSlots ?? [];
  const allTimesForDate = [...freeSlotsForDate, ...bookedSlotsForDate].sort();

  // Загрузка слотов при выборе врача
  useEffect(() => {
    if (!bookingDoctor?.id || !selectedService) return;
    setSlotsLoading(true);
    setAvailableSlots({ available: [] });
    const today = new Date();
    const from = today.toISOString().slice(0, 10);
    const toDate = new Date(today);
    toDate.setDate(toDate.getDate() + 28);
    const to = toDate.toISOString().slice(0, 10);
    getAvailableSlots(bookingDoctor.id, from, to)
      .then((data) => setAvailableSlots(data ?? { available: [] }))
      .catch(() => setAvailableSlots({ available: [] }))
      .finally(() => setSlotsLoading(false));
  }, [bookingDoctor?.id, selectedService]);

  const handleStartBooking = () => {
    if (!currentUser) {
      openInfo({
        title: 'Вход в аккаунт',
        message: 'Войдите в аккаунт, чтобы записаться на услугу.',
        variant: 'info',
      });
      navigate('/auth');
      return;
    }
    if (serviceDoctors.length === 0) {
      openInfo({
        title: 'Нет специалистов',
        message: 'К этой услуге пока не привязаны врачи. Обратитесь в регистратуру.',
        variant: 'info',
      });
      return;
    }
    setBookingStep(1);
    setBookingDoctor(null);
    setBookingDate('');
    setBookingTime('');
    setBookingError('');
  };

  const handleBookingDoctorSelect = (doctor) => {
    setBookingDoctor(doctor);
    setBookingDate('');
    setBookingTime('');
    setBookingStep(2);
  };

  const handleBookingDateSelect = (date) => {
    setBookingDate(date);
    setBookingTime('');
    setBookingStep(3);
  };

  const handleConfirmBooking = () => {
    if (!bookingDoctor?.id || !bookingDate || !bookingTime) return;
    if (bookedSlotsForDate.includes(bookingTime)) return;
    setBookingError('');
    setBookingSubmitting(true);
    createAppointment({
      doctorId: bookingDoctor.id,
      dateVisit: bookingDate,
      time: bookingTime,
    })
      .then(() => {
        openInfo({
          title: 'Запись оформлена',
          message: `Вы записаны на услугу «${selectedService?.title}».\nВрач: ${bookingDoctor.fullName ?? 'Врач'}\nДата: ${bookingDate}\nВремя: ${bookingTime}\nОжидайте подтверждения.`,
          variant: 'success',
        });
        setSelectedService(null);
        setBookingStep(0);
        setBookingDoctor(null);
        setBookingDate('');
        setBookingTime('');
      })
      .catch((err) => {
        const msg = err?.response?.data?.message ?? (err?.response?.status === 401 ? 'Войдите в аккаунт, чтобы записаться' : 'Не удалось создать запись');
        setBookingError(msg);
      })
      .finally(() => setBookingSubmitting(false));
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    setBookingStep(0);
    setBookingDoctor(null);
    setBookingDate('');
    setBookingTime('');
    setBookingError('');
  };

  const handleBackFromBooking = () => {
    if (bookingStep === 1) setBookingStep(0);
    else if (bookingStep === 2) {
      setBookingDoctor(null);
      setBookingDate('');
      setBookingTime('');
      setBookingStep(1);
    } else if (bookingStep === 3) {
      setBookingDate('');
      setBookingTime('');
      setBookingStep(2);
    }
  };

  useEffect(() => {
    fetchClinicCategories();
    fetchServices();
  }, []);

  useEffect(() => {
    fetchServices(Number.isNaN(+selectedCategory) ? undefined : +selectedCategory, searchQuery);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="services-container">
          <div className="services-header">
            <div className="services-tag">
              <div className="services-tag-dot"></div>
              МЕДИЦИНСКИЕ УСЛУГИ
            </div>
            <h1 className="services-title">
              Услуги медицинского центра
              <span className="services-title-highlight">MediCare</span>
            </h1>
            <p className="services-description">
              Полный спектр медицинских услуг для взрослых и детей. 
              Современное оборудование, опытные специалисты и индивидуальный подход.
            </p>
          </div>

          {/* Поиск */}
          <div className="services-search">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Поиск услуг..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  <Cross size={16} />
                </button>
              )}
            </div>
            <div className="search-results">
              Найдено услуг: <span>{services.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Категории в стиле страницы врачей */}
      <section className="services-specialties-section">
        <div className="services-container">
          <div className="specialties-header">
            <h2>Категории услуг</h2>
            <p>Выберите направление медицины</p>
          </div>
          
          <div className="specialties-grid">
            <button
                className={`specialty-card ${selectedCategory === 'all' ? 'selected' : ''}`}
                onClick={() => setSelectedCategory('all')}
                style={{ '--specialty-color': serviceCategoryIcon('all')[1] }}
            >
              <div className="specialty-icon">
                { serviceCategoryIcon('all')[0] }
              </div>
              <div className="specialty-info">
                <span className="specialty-name">Все услуги</span>
                <span className="specialty-count">
                    {allServices} услуг
                  </span>
              </div>
            </button>
            {Object.keys(clinicCategories).map((category) => (
              <button
                key={category}
                className={`specialty-card ${selectedCategory === category ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(category)}
                style={{ '--specialty-color': serviceCategoryIcon(clinicCategories[category].name)[1] }}
              >
                <div className="specialty-icon">
                  { serviceCategoryIcon(clinicCategories[category].name)[0] }
                </div>
                <div className="specialty-info">
                  <span className="specialty-name">{clinicCategories[category].clinicLocaleName}</span>
                  <span className="specialty-count">
                    {category === 'all'
                      ? allServices
                      : clinicCategories[category].servicesCnt
                    } услуг
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="services-benefits">
        <div className="services-container">
          <div className="benefits-header">
            <h2>Наши преимущества</h2>
            <p>Почему пациенты выбирают MediCare</p>
          </div>
          
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-item">
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

      <section className="services-list">
        <div className="services-container">
          <div className="services-list-header">
            <h2>Доступные услуги</h2>
            <p>Выберите подходящую услугу для записи</p>
          </div>

          {services.length === 0 ? (
            <div className="no-results">
              <p>Услуги не найдены. Попробуйте изменить поисковый запрос или выбрать другую категорию.</p>
            </div>
          ) : (
            <div className="services-grid">
              {services.map((service) => (
                <div 
                  key={service.id}
                  className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                  onClick={() => handleServiceSelect(service)}
                >
                  {Number(service.rating) > 4.5 && (
                    <div className="featured-badge">
                      <Sparkles size={12} />
                      <span>Популярно</span>
                    </div>
                  )}
                  
                  <div className="service-header">
                    <div className="service-category">
                      <span>{service.clinicType.name}</span>
                    </div>
                    <div className="service-rating">
                      <Star size={14} />
                      <span>{service.rating}</span>
                    </div>
                  </div>
                  
                  <h3>{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  
                  <div className="service-features">
                    <div className="feature">
                      <Clock size={16} />
                      <span>{service.timeWork}</span>
                    </div>
                    <div className="feature">
                      <Users size={16} />
                      <span>{(service.doctors?.length ?? 0)} специалист{(service.doctors?.length ?? 0) === 1 ? '' : 'а'}</span>
                    </div>
                  </div>
                  
                  <div className="service-popularity">
                    <div className="popularity-bar">
                      <div 
                        className="popularity-fill" 
                        style={{ width: `${service.popularity}%` }}
                      />
                    </div>
                    <span>{((service.recLike / (service.recLike + service.recDeslike)) * 100).toFixed(2)}% пациентов рекомендуют</span>
                  </div>
                  
                  <div className="service-price">
                    <span>{service.price}</span>
                    <button 
                      className="service-book-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceSelect(service);
                      }}
                    >
                      Подробнее
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedService && (
        <div className="service-modal-overlay" onClick={handleCloseModal}>
          <div className="service-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-content">
                <h2>{bookingStep === 0 ? selectedService.title : 'Запись на услугу'}</h2>
                <p className="modal-category">
                  {bookingStep === 0 ? (selectedService.clinicType?.name ?? '') : `${selectedService.title} — шаг ${bookingStep} из 3`}
                </p>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={handleCloseModal}
                aria-label="Закрыть"
              >
                <Cross size={24} />
              </button>
            </div>

            <div className="modal-content">
              {bookingStep === 0 && (
                <>
                  <div className="modal-details">
                    <div className="detail-row">
                      <div className="detail-item">
                        <Calendar size={18} />
                        <div>
                          <span className="detail-label">Длительность</span>
                          <span className="detail-value">{selectedService.timeWork}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <Users size={18} />
                        <div>
                          <span className="detail-label">Стоимость</span>
                          <span className="detail-value price">{selectedService.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="modal-description">
                      <h3>Описание услуги</h3>
                      <p>{selectedService.description}</p>
                    </div>
                    <div className="modal-features">
                      <h3>Что входит в услугу</h3>
                      <ul>
                        {(selectedService.includesIn ?? []).map((feature, index) => (
                          <li key={index}>
                            <Check size={16} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="modal-specialists">
                      <h3>Специалисты</h3>
                      <div className="specialists-list">
                        {serviceDoctors.length === 0 ? (
                          <span className="specialist-tag specialist-tag-empty">Нет привязанных врачей</span>
                        ) : (
                          serviceDoctors.map((doctor) => (
                            <span key={doctor.id} className="specialist-tag">
                              {doctor.fullName ?? `Врач #${doctor.id}`}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="modal-rating">
                      <div className="rating-value">
                        <Star size={20} />
                        <span>{selectedService.rating}</span>
                        <span className="rating-label">рейтинг</span>
                      </div>
                      <div className="rating-popularity">
                        <span>{Number(selectedCategory?.recLike > 0 ? selectedCategory.recLike : 90) / Number(selectedCategory?.recDeslike > 0 ? selectedCategory.recDeslike : 1)}%</span>
                        <span className="popularity-label">пациентов рекомендуют</span>
                      </div>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="modal-back-button" onClick={handleCloseModal}>
                      Назад к списку
                    </button>
                    <button type="button" className="modal-book-button" onClick={handleStartBooking}>
                      <Calendar size={18} />
                      <span>Записаться на услугу</span>
                    </button>
                  </div>
                </>
              )}

              {bookingStep === 1 && (
                <>
                  <div className="service-booking-step">
                    <h3>Выберите врача</h3>
                    <div className="service-booking-doctors">
                      {serviceDoctors.map((doctor) => (
                        <button
                          key={doctor.id}
                          type="button"
                          className={`service-booking-doctor-card ${bookingDoctor?.id === doctor.id ? 'selected' : ''}`}
                          onClick={() => handleBookingDoctorSelect(doctor)}
                        >
                          <div className="service-booking-doctor-avatar">
                            <User size={22} />
                          </div>
                          <div className="service-booking-doctor-info">
                            <span className="service-booking-doctor-name">{doctor.fullName ?? `Врач #${doctor.id}`}</span>
                            <span className="service-booking-doctor-meta">{doctor.clinicType?.name ?? doctor.position ?? '—'}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="modal-back-button" onClick={handleBackFromBooking}>
                      Назад к услуге
                    </button>
                  </div>
                </>
              )}

              {bookingStep === 2 && bookingDoctor && (
                <>
                  <div className="service-booking-step">
                    <h3>Выберите дату</h3>
                    <p className="service-booking-subtitle">{bookingDoctor.fullName} — доступные дни</p>
                    {slotsLoading ? (
                      <div className="service-booking-loading">
                        <Loader2 size={24} className="service-booking-spinner" />
                        <span>Загрузка дат…</span>
                      </div>
                    ) : availableDates.length === 0 ? (
                      <p className="service-booking-empty">Нет доступных дат на ближайшие 4 недели</p>
                    ) : (
                      <div className="service-booking-dates">
                        {availableDates.map((a) => {
                          const isDateFullyBooked = (a.slots?.length ?? 0) === 0 && (a.bookedSlots?.length ?? 0) > 0;
                          return (
                            <button
                              key={a.date}
                              type="button"
                              className={`service-booking-date-btn ${bookingDate === a.date ? 'selected' : ''} ${isDateFullyBooked ? 'disabled' : ''}`}
                              disabled={isDateFullyBooked}
                              title={isDateFullyBooked ? 'Дата забронирована' : undefined}
                              onClick={() => !isDateFullyBooked && handleBookingDateSelect(a.date)}
                            >
                              {new Date(a.date + 'T12:00:00').toLocaleDateString('ru-RU', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                              })}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="modal-back-button" onClick={handleBackFromBooking}>
                      Назад
                    </button>
                  </div>
                </>
              )}

              {bookingStep === 3 && bookingDoctor && bookingDate && (
                <>
                  <div className="service-booking-step">
                    <h3>Выберите время</h3>
                    <p className="service-booking-subtitle">{bookingDate}</p>
                    {slotsLoading ? (
                      <div className="service-booking-loading">
                        <Loader2 size={24} className="service-booking-spinner" />
                        <span>Загрузка времени…</span>
                      </div>
                    ) : allTimesForDate.length === 0 ? (
                      <p className="service-booking-empty">Нет доступного времени на эту дату</p>
                    ) : (
                      <div className="service-booking-times">
                        {allTimesForDate.map((time) => {
                          const isBooked = bookedSlotsForDate.includes(time);
                          return (
                            <button
                              key={time}
                              type="button"
                              className={`service-booking-time-btn ${bookingTime === time ? 'selected' : ''} ${isBooked ? 'disabled' : ''}`}
                              disabled={isBooked}
                              title={isBooked ? 'Дата забронирована' : undefined}
                              onClick={() => !isBooked && setBookingTime(time)}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {bookingError && <p className="service-booking-error">{bookingError}</p>}
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="modal-back-button" onClick={handleBackFromBooking}>
                      Назад
                    </button>
                    <button
                      type="button"
                      className="modal-book-button"
                      disabled={!bookingTime || bookingSubmitting}
                      onClick={handleConfirmBooking}
                    >
                      {bookingSubmitting ? (
                        <>
                          <Loader2 size={18} className="service-booking-spinner" />
                          <span>Оформление…</span>
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          <span>Подтвердить запись</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;