import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  Star, 
  Award,
  Calendar,
  Clock,
  GraduationCap,
  ChevronLeft,
  Phone,
  Check,
  Shield,
  MessageSquare,
  ThumbsUp,
  Edit,
  X,
  Send,
  Mail,
  MapPin,
  Video,
  ChevronRight,
  Loader2
} from 'lucide-react';
import './DoctorDetailPage.css';
import { DoctorAPI } from '../../api/doctor';
import { ReviewAPI } from '../../api/review';
import { getAvailableSlots, createAppointment } from '../../api/appointments';
import { useAuth } from '../../context/AuthContext';
import { useInfoModal } from '../../context/InfoModalContext';

const AVATAR_COLORS = ['#10b981', '#8b5cf6', '#f59e0b', '#0ea5e9', '#ec4899', '#06b6d4'];

const formatPrice = (value) => {
  if (value == null || value === '') return '—';
  const num = Number(value);
  return Number.isNaN(num) ? '—' : `${num.toLocaleString('ru-RU')} ₽`;
};

const formatReviewDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('ru-RU');
};

const DoctorDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { openInfo } = useInfoModal();
  const isAuthenticated = !!currentUser;
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [reviewsPage, setReviewsPage] = useState(1);
  const reviewsPageSize = 3;
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [key, setKey] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    symptoms: '',
    consultationType: 'in-person'
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlotsData, setAvailableSlotsData] = useState({ available: [] });
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingSubmitError, setBookingSubmitError] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const doctorId = parseInt(id, 10);
    if (Number.isNaN(doctorId)) {
      setLoading(false);
      setDoctor(null);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([
      DoctorAPI.getById(doctorId),
      ReviewAPI.getByDoctorId(doctorId, 1, 5).catch(() => ({ list: [], total: 0, page: 1, pageSize: 5 }))
    ])
      .then(([data, reviewsData]) => {
        if (cancelled) return;
        const doc = data ?? {};
        setDoctor(doc);
        const list = reviewsData?.list ?? [];
        setReviewsTotal(reviewsData?.total ?? 0);
        setReviewsPage(reviewsData?.page ?? 1);
        setReviews(list.map((r) => ({
          id: r.id,
          author: r.user?.fullName ?? 'Гость',
          date: formatReviewDate(r.createdAt),
          rating: r.rating ?? 0,
          text: r.message ?? '',
          verified: false,
          likes: r.likes ?? 0
        })));
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.response?.status === 404 ? null : err?.message || 'Не удалось загрузить данные');
          setDoctor(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id, key]);

  useEffect(() => {
    if (!isBookingModalOpen || !doctor?.id) return;
    setSlotsLoading(true);
    setAvailableSlotsData({ available: [] });
    const today = new Date();
    const from = today.toISOString().slice(0, 10);
    const toDate = new Date(today);
    toDate.setDate(toDate.getDate() + 28);
    const to = toDate.toISOString().slice(0, 10);
    getAvailableSlots(doctor.id, from, to)
      .then((data) => setAvailableSlotsData(data ?? { available: [] }))
      .catch(() => setAvailableSlotsData({ available: [] }))
      .finally(() => setSlotsLoading(false));
  }, [isBookingModalOpen, doctor?.id]);

  const imageColor = doctor ? (AVATAR_COLORS[doctor.id % AVATAR_COLORS.length]) : '#10b981';
  const scheduleStr = doctor?.dayWork?.days?.length && doctor?.scheduleWork
    ? `${(doctor.dayWork.days || []).join(', ')}, ${doctor.scheduleWork}`
    : (doctor?.scheduleWork || '—');
  const servicesList = (doctor?.services?.length ? doctor.services : doctor?.competencies) || [];
  const certificatesList = doctor?.certificates || [];
  const consultationTypes = doctor?.formatWork
    ? ['in-person', 'online'].filter(() => true)
    : ['in-person'];

  if (loading) {
    return (
      <div className="doctor-detail-page doctor-detail-loading">
        <div className="doctor-detail-container">
          <div className="doctor-detail-loading-content">
            <Loader2 size={48} className="doctor-detail-spinner" />
            <p>Загрузка данных врача...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-detail-not-found">
        <div className="doctor-detail-container">
          <h1>Ошибка загрузки</h1>
          <p>{error}</p>
          <Link to="/doctors" className="doctor-detail-back-button">
            <ChevronLeft size={20} />
            Вернуться к списку врачей
          </Link>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doctor-detail-not-found">
        <div className="doctor-detail-container">
          <h1>Врач не найден</h1>
          <p>Попробуйте выбрать другого специалиста</p>
          <Link to="/doctors" className="doctor-detail-back-button">
            <ChevronLeft size={20} />
            Вернуться к списку врачей
          </Link>
        </div>
      </div>
    );
  }

  const fetchReviews = (page = reviewsPage) => {
    const doctorId = parseInt(id, 10);
    if (Number.isNaN(doctorId)) return;
    setReviewsLoading(true);
    ReviewAPI.getByDoctorId(doctorId, page, reviewsPageSize)
      .then((data) => {
        const list = data?.list ?? [];
        setReviewsTotal(data?.total ?? 0);
        setReviewsPage(data?.page ?? page);
        setReviews(list.map((r) => ({
          id: r.id,
          author: r.user?.fullName ?? 'Гость',
          date: formatReviewDate(r.createdAt),
          rating: r.rating ?? 0,
          text: r.message ?? '',
          verified: false,
          likes: 0
        })));
      })
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  };

  const reviewsTotalPages = Math.max(1, Math.ceil(reviewsTotal / reviewsPageSize));
  const goToReviewsPage = (p) => {
    const next = Math.max(1, Math.min(reviewsTotalPages, p));
    if (next !== reviewsPage) fetchReviews(next);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setReviewSubmitError('');
    if (!newReview.trim() || !doctor) {
      setReviewSubmitError('Введите текст отзыва.');
      return;
    }
    setReviewSubmitting(true);
    const payload = { message: newReview.trim(), rating: Number(newRating) || 5 };
    ReviewAPI.create(doctor.id, payload)
      .then(() => {
        setNewReview('');
        setNewRating(5);
        setShowReviewForm(false);
        setReviewSubmitError('');
        fetchReviews(1);
      })
      .catch((err) => {
        const msg =
          (err?.response?.data?.message) ||
          (typeof err?.message === 'string' ? err.message : 'Не удалось отправить отзыв');
        setReviewSubmitError(msg);
      })
      .finally(() => {
        setReviewSubmitting(false);
      });
  };

  const handleLikeReview = async (reviewId) => {
    await DoctorAPI.setReviewLike(reviewId);
    setTimeout(() => {
      setKey(state => state + 1);
    }, 500);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (bookingStep !== 4 || !doctor?.id || !selectedDate || !selectedTime) return;
    if (bookedSlotsForDate.includes(selectedTime)) return;
    setBookingSubmitError('');
    setBookingSubmitting(true);
    createAppointment({
      doctorId: doctor.id,
      dateVisit: selectedDate,
      time: selectedTime,
    })
      .then(() => {
        openInfo({
          title: 'Запись оформлена',
          message: `Запись успешно оформлена!\nВрач: ${doctorName}\nДата: ${selectedDate}\nВремя: ${selectedTime}\nТип: ${formData.consultationType === 'in-person' ? 'Очная' : 'Онлайн'}\nМы свяжемся с вами для подтверждения.`,
          variant: 'success',
        });
        setIsBookingModalOpen(false);
        resetBooking();
      })
      .catch((err) => {
        const msg = err?.response?.data?.message ?? (err?.response?.status === 401 ? 'Войдите в аккаунт, чтобы записаться' : 'Не удалось создать запись');
        setBookingSubmitError(msg);
      })
      .finally(() => setBookingSubmitting(false));
  };

  const resetBooking = () => {
    setSelectedDate('');
    setSelectedTime('');
    setBookingStep(1);
    setAvailableSlotsData({ available: [] });
    setBookingSubmitError('');
    setFormData({
      name: '',
      phone: '',
      email: '',
      symptoms: '',
      consultationType: 'in-person'
    });
  };

  const startBooking = () => {
    setIsBookingModalOpen(true);
    resetBooking();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setBookingStep(3);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setBookingStep(4);
  };

  const consultationTypesList = [
    {
      id: 'in-person',
      title: 'Очная консультация',
      icon: MapPin,
      description: 'Личный прием в медицинском центре'
    },
    {
      id: 'online',
      title: 'Онлайн консультация',
      icon: Video,
      description: 'Консультация по видеосвязи из любого места'
    }
  ];
  const availableSlotsList = availableSlotsData?.available ?? [];
  const dayData = selectedDate ? availableSlotsList.find((a) => a.date === selectedDate) : null;
  const freeSlotsForDate = dayData?.slots ?? [];
  const bookedSlotsForDate = dayData?.bookedSlots ?? [];
  const allTimesForDate = [...freeSlotsForDate, ...bookedSlotsForDate].sort();
  const doctorName = doctor.fullName;

  return (
    <div className="doctor-detail-page">
      {/* Герой-секция */}
      <section className="doctor-detail-hero">
        <div className="doctor-detail-container">
          <Link to="/doctors" className="doctor-detail-back-link">
            <ChevronLeft size={20} />
            <span>Назад к врачам</span>
          </Link>
          
          <div className="doctor-detail-header">
            <div className="doctor-detail-main-info">
              <div className="doctor-detail-avatar" style={{ backgroundColor: imageColor }}>
                <User size={48} color="white" />
              </div>
              
              <div className="doctor-detail-header-content">
                <div className="doctor-detail-tags">
                  <span className="doctor-detail-specialty-tag">
                    {doctor.clinicType?.name ?? 'Специалист'}
                  </span>
                  {doctor.competencies?.length > 0 && (
                    <span className="doctor-detail-featured-tag">
                      <Star size={14} />
                      Рекомендуем
                    </span>
                  )}
                </div>
                
                <h1 className="doctor-detail-name">{doctor.fullName}</h1>
                <p className="doctor-detail-position">{doctor.position || '—'}</p>
                
                <div className="doctor-detail-rating">
                  <div className="doctor-detail-rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={20} 
                        fill={i < Math.floor(Number(doctor.rating)) ? "#f59e0b" : "none"}
                        color={i < Number(doctor.rating) ? "#f59e0b" : "#e2e8f0"}
                      />
                    ))}
                  </div>
                  <div className="doctor-detail-rating-info">
                    <span className="doctor-detail-rating-value">{Number(doctor.rating) ?? '—'}</span>
                    <span className="doctor-detail-rating-reviews">({reviews.length} отзывов)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="doctor-detail-actions">
              <div className="doctor-detail-price">
                <span className="doctor-detail-price-label">Стоимость консультации</span>
                <span className="doctor-detail-price-value">{formatPrice(doctor.consultPrice)}</span>
              </div>
              <button 
                className="doctor-detail-book-button"
                onClick={startBooking}
              >
                <Calendar size={20} />
                <span>Записаться на прием</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Основной контент */}
      <div className="doctor-detail-container">
        <div className="doctor-detail-content-grid">
          {/* Левая колонка - информация */}
          <div className="doctor-detail-info-section">
            <div className="doctor-detail-section-card">
              <h2 className="doctor-detail-section-title">
                <User size={20} />
                О враче
              </h2>
              <p className="doctor-detail-description">
                {doctor.description || [doctor.position, doctor.studyBuild].filter(Boolean).join('. ') || '—'}
              </p>
              
              <div className="doctor-detail-info-grid">
                <div className="doctor-detail-info-item">
                  <Clock size={20} />
                  <div>
                    <h4>Опыт работы</h4>
                    <p>{doctor.experience ?? 0} лет</p>
                  </div>
                </div>
                
                <div className="doctor-detail-info-item">
                  <Calendar size={20} />
                  <div>
                    <h4>Расписание</h4>
                    <p>{scheduleStr}</p>
                  </div>
                </div>
                
                <div className="doctor-detail-info-item">
                  <GraduationCap size={20} />
                  <div>
                    <h4>Образование</h4>
                    <p>{doctor.education || doctor.studyBuild || '—'}</p>
                  </div>
                </div>
                
                <div className="doctor-detail-info-item">
                  <Shield size={20} />
                  <div>
                    <h4>Контакты</h4>
                    <p>{doctor.phone || doctor.email || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {servicesList.length > 0 && (
              <div className="doctor-detail-section-card">
                <h2 className="doctor-detail-section-title">
                  <Check size={20} />
                  Услуги
                </h2>
                <div className="doctor-detail-services-grid">
                  {servicesList.map((service, index) => (
                    <div key={index} className="doctor-detail-service-item">
                      <Check size={16} />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certificatesList.length > 0 && (
              <div className="doctor-detail-section-card">
                <h2 className="doctor-detail-section-title">
                  <Award size={20} />
                  Сертификаты
                </h2>
                <div className="doctor-detail-certifications-grid">
                  {certificatesList.map((cert, index) => (
                    <div key={index} className="doctor-detail-cert-item">
                      <Award size={16} />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Правая колонка - отзывы и контакты */}
          <div className="doctor-detail-sidebar">
            <div className="doctor-detail-section-card">
              <div className="doctor-detail-sidebar-header">
                <h2 className="doctor-detail-section-title">
                  <MessageSquare size={20} />
                  Отзывы пациентов
                  <span className="doctor-detail-reviews-count">({reviewsTotal})</span>
                </h2>
                {isAuthenticated ? (
                  <button 
                    className="doctor-detail-add-review-btn"
                    onClick={() => setShowReviewForm(true)}
                  >
                    <Edit size={18} />
                    Написать отзыв
                  </button>
                ) : (
                  <p className="doctor-detail-review-login-hint">
                    <Link to="/auth">Войдите</Link>, чтобы оставить отзыв
                  </p>
                )}
              </div>

              {/* Форма отзыва (только для авторизованных) */}
              {showReviewForm && isAuthenticated && (
                <div className="doctor-detail-review-form">
                  <div className="doctor-detail-review-form-header">
                    <h3>Оставить отзыв</h3>
                    <button 
                      type="button"
                      className="doctor-detail-close-btn"
                      onClick={() => { setShowReviewForm(false); setReviewSubmitError(''); }}
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmitReview}>
                    {reviewSubmitError && (
                      <p className="doctor-detail-review-error">{reviewSubmitError}</p>
                    )}
                    <div className="doctor-detail-rating-selector">
                      <span>Ваша оценка:</span>
                      <div className="doctor-detail-stars-selector">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`doctor-detail-star-selector-btn ${star <= newRating ? 'active' : ''}`}
                            onClick={() => setNewRating(star)}
                          >
                            <Star size={24} />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="doctor-detail-form-group">
                      <textarea
                        placeholder="Поделитесь вашим опытом..."
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        rows={4}
                        required
                        disabled={reviewSubmitting}
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      className="doctor-detail-submit-btn" 
                      disabled={reviewSubmitting}
                    >
                      <Send size={18} />
                      {reviewSubmitting ? 'Отправка...' : 'Отправить отзыв'}
                    </button>
                  </form>
                </div>
              )}

              {/* Список отзывов */}
              {reviewsLoading && (
                <div className="doctor-detail-reviews-loading">
                  <Loader2 size={24} className="doctor-detail-spinner" />
                  <span>Загрузка отзывов...</span>
                </div>
              )}
              <div className="doctor-detail-reviews-list">
                {!reviewsLoading && reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="doctor-detail-review-item">
                      <div className="doctor-detail-review-header">
                        <div className="doctor-detail-review-author">
                          <div className="doctor-detail-author-avatar">
                            {review.author.charAt(0)}
                          </div>
                          <div className="doctor-detail-author-info">
                            <span className="doctor-detail-author-name">{review.author}</span>
                            <span className="doctor-detail-review-date">{review.date}</span>
                          </div>
                        </div>
                        
                        <div className="doctor-detail-review-rating">
                          <div className="doctor-detail-review-stars">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={16} 
                                fill={i < review.rating ? "#f59e0b" : "none"}
                                color={i < review.rating ? "#f59e0b" : "#e2e8f0"}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <p className="doctor-detail-review-text">{review.text}</p>
                      
                      <div className="doctor-detail-review-footer">
                        {review.verified && (
                          <span className="doctor-detail-verified-badge">
                            <Check size={12} />
                            Проверенный отзыв
                          </span>
                        )}
                        <button 
                          className="doctor-detail-like-btn"
                          onClick={() => handleLikeReview(review.id)}
                        >
                          <ThumbsUp size={16} />
                          <span>{review.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : !reviewsLoading ? (
                  <div className="doctor-detail-no-reviews">
                    <MessageSquare size={48} />
                    <p>Пока нет отзывов</p>
                    <p>Будьте первым, кто оставит отзыв</p>
                  </div>
                ) : null}
              </div>
              {reviewsTotal > reviewsPageSize && !reviewsLoading && (
                <div className="doctor-detail-reviews-pagination">
                  <button
                    type="button"
                    className="doctor-detail-pagination-btn"
                    disabled={reviewsPage <= 1}
                    onClick={() => goToReviewsPage(reviewsPage - 1)}
                    aria-label="Предыдущая страница"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="doctor-detail-pagination-info">
                    {reviewsPage} из {reviewsTotalPages}
                  </span>
                  <button
                    type="button"
                    className="doctor-detail-pagination-btn"
                    disabled={reviewsPage >= reviewsTotalPages}
                    onClick={() => goToReviewsPage(reviewsPage + 1)}
                    aria-label="Следующая страница"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="doctor-detail-section-card">
              <h2 className="doctor-detail-section-title">
                <Phone size={20} />
                Контакты
              </h2>
              <div className="doctor-detail-contacts-list">
                {doctor.phone && (
                  <div className="doctor-detail-contact-item">
                    <Phone size={20} />
                    <div>
                      <h4>Телефон</h4>
                      <a href={`tel:${doctor.phone}`}>{doctor.phone}</a>
                    </div>
                  </div>
                )}
                {doctor.email && (
                  <div className="doctor-detail-contact-item">
                    <Mail size={20} />
                    <div>
                      <h4>Email</h4>
                      <a href={`mailto:${doctor.email}`}>{doctor.email}</a>
                    </div>
                  </div>
                )}
                {(!doctor.phone && !doctor.email) && (
                  <p className="doctor-detail-no-contacts">Контакты не указаны</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно записи */}
      {isBookingModalOpen && (
        <div className="doctor-detail-modal-overlay" onClick={() => setIsBookingModalOpen(false)}>
          <div className="doctor-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="doctor-detail-modal-header">
              <h2>Запись на прием к {doctor.fullName}</h2>
              <button 
                className="doctor-detail-modal-close"
                onClick={() => setIsBookingModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="doctor-detail-modal-steps">
              <div className={`doctor-detail-step ${bookingStep >= 1 ? 'active' : ''}`}>
                <div className="doctor-detail-step-number">1</div>
                <span>Тип приема</span>
              </div>
              <div className={`doctor-detail-step ${bookingStep >= 2 ? 'active' : ''}`}>
                <div className="doctor-detail-step-number">2</div>
                <span>Дата</span>
              </div>
              <div className={`doctor-detail-step ${bookingStep >= 3 ? 'active' : ''}`}>
                <div className="doctor-detail-step-number">3</div>
                <span>Время</span>
              </div>
              <div className={`doctor-detail-step ${bookingStep >= 4 ? 'active' : ''}`}>
                <div className="doctor-detail-step-number">4</div>
                <span>Данные</span>
              </div>
            </div>

            <div className="doctor-detail-modal-content">
              {bookingStep === 1 && (
                <div className="doctor-detail-step-content">
                  <h3>Выберите тип приема</h3>
                  <div className="doctor-detail-consultation-types-select">
                    {consultationTypesList.map((type) => (
                      <div 
                        key={type.id}
                        className={`doctor-detail-consultation-type-card ${formData.consultationType === type.id ? 'selected' : ''}`}
                        onClick={() => {
                          setFormData({...formData, consultationType: type.id});
                          setBookingStep(2);
                        }}
                      >
                        <div className="doctor-detail-consultation-type-icon">
                          <type.icon size={24} />
                        </div>
                        <div className="doctor-detail-consultation-type-info">
                          <h4>{type.title}</h4>
                          <p>{type.description}</p>
                        </div>
                        <ChevronRight size={20} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="doctor-detail-step-content">
                  <h3>Выберите дату</h3>
                  <div className="doctor-detail-dates-select">
                    {slotsLoading ? (
                      <p className="doctor-detail-no-slots">Загрузка дат…</p>
                    ) : availableSlotsList.length === 0 ? (
                      <p className="doctor-detail-no-slots">Нет доступных слотов. Обратитесь в регистратуру.</p>
                    ) : (
                      availableSlotsList.map((a) => {
                        const isDateFullyBooked = (a.slots?.length ?? 0) === 0 && (a.bookedSlots?.length ?? 0) > 0;
                        return (
                          <button
                            key={a.date}
                            type="button"
                            className={`doctor-detail-date-button ${selectedDate === a.date ? 'selected' : ''} ${isDateFullyBooked ? 'disabled' : ''}`}
                            disabled={isDateFullyBooked}
                            title={isDateFullyBooked ? 'Дата забронирована' : undefined}
                            onClick={() => !isDateFullyBooked && handleDateSelect(a.date)}
                          >
                            {new Date(a.date + 'T12:00:00').toLocaleDateString('ru-RU', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                            })}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {bookingStep === 3 && selectedDate && (
                <div className="doctor-detail-step-content">
                  <h3>Выберите время</h3>
                  <div className="doctor-detail-times-select">
                    {slotsLoading ? (
                      <p className="doctor-detail-no-slots">Загрузка времени…</p>
                    ) : allTimesForDate.length === 0 ? (
                      <p className="doctor-detail-no-slots">Нет доступного времени.</p>
                    ) : (
                      allTimesForDate.map((time) => {
                        const isBooked = bookedSlotsForDate.includes(time);
                        return (
                          <button
                            key={time}
                            type="button"
                            className={`doctor-detail-time-button ${selectedTime === time ? 'selected' : ''} ${isBooked ? 'disabled' : ''}`}
                            disabled={isBooked}
                            title={isBooked ? 'Дата забронирована' : undefined}
                            onClick={() => !isBooked && handleTimeSelect(time)}
                          >
                            {time}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {bookingStep === 4 && (
                <div className="doctor-detail-step-content">
                  <h3>Ваши данные</h3>
                  <form onSubmit={handleSubmitBooking}>
                    {bookingSubmitError && (
                      <p className="doctor-detail-booking-error">{bookingSubmitError}</p>
                    )}
                    <div className="doctor-detail-form-group">
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
                    <div className="doctor-detail-form-group">
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
                    <div className="doctor-detail-form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="doctor-detail-form-group">
                      <label>Симптомы или причина обращения</label>
                      <textarea
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleFormChange}
                        rows="3"
                        placeholder="Опишите ваши симптомы..."
                      />
                    </div>
                    
                    <div className="doctor-detail-booking-summary">
                      <h4>Детали записи:</h4>
                      <p><strong>Врач:</strong> {doctor.fullName}</p>
                      <p><strong>Тип:</strong> {formData.consultationType === 'in-person' ? 'Очная консультация' : 'Онлайн консультация'}</p>
                      <p><strong>Дата:</strong> {selectedDate || '—'}</p>
                      <p><strong>Время:</strong> {selectedTime || '—'}</p>
                      <p><strong>Стоимость:</strong> {formatPrice(doctor.consultPrice)}</p>
                    </div>
                    
                    <button
                      type="submit"
                      className="doctor-detail-submit-booking-button"
                      disabled={bookingSubmitting}
                    >
                      {bookingSubmitting ? 'Оформление…' : 'Подтвердить запись'}
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div className="doctor-detail-modal-footer">
              {bookingStep > 1 && (
                <button 
                  className="doctor-detail-modal-back-button"
                  onClick={() => setBookingStep(bookingStep - 1)}
                >
                  Назад
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA секция */}
      <section className="doctor-detail-cta-section">
        <div className="doctor-detail-container">
          <div className="doctor-detail-cta-content">
            <h2>Записаться на прием к врачу</h2>
            <p>Выберите удобное время для консультации у {doctor.fullName}</p>
            <div className="doctor-detail-cta-buttons">
              <Link to="/doctors" className="doctor-detail-cta-btn secondary">
                <ChevronLeft size={18} />
                <span>Назад к врачам</span>
              </Link>
              <button 
                className="doctor-detail-cta-btn primary"
                onClick={startBooking}
              >
                <Calendar size={18} />
                <span>Записаться на прием</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorDetailPage;