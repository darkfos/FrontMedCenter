import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Star,
  Award,
  Calendar,
  Clock,
  Heart,
  Brain,
  Bone,
  Eye,
  Baby,
  Search,
  X,
  Phone,
  Check,
  Sparkles,
  Shield,
  ChevronRight, Stethoscope, Scissors, Pill
} from 'lucide-react';
import './DoctorsPage.css';

import { ClinicAPI } from "../../api/clinic";
import { debounce } from "../../utils/debounce";
import {DoctorAPI} from "../../api/doctor";

const DoctorsPage = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [clinicCategories, setClinicCategories] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const fetchClinicCategories = useMemo(() => {
    return debounce(async () => {
      const data = await ClinicAPI.allClinicWithDoctors();
      setClinicCategories(data);
    }, 500);
  }, [debounce]);

  const allDoctors = useMemo(() => {
    let cntDoctors = 0;

    Object.keys(clinicCategories).forEach((clinic) => {
      cntDoctors += clinicCategories[clinic].doctorCnt;
    })
    return cntDoctors;
  }, [clinicCategories]);

  const fetchFilteredDoctors = useMemo(() => {
    return debounce(async (...args) => {
      const data = await DoctorAPI.getFilteredDoctors(...args);
      setFilteredDoctors(data);
    })
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

  const stats = [
    { icon: Award, value: '15+', label: 'Лет средний опыт' },
    { icon: Star, value: '4.8', label: 'Средний рейтинг' },
    { icon: User, value: '95%', label: 'Пациентов рекомендуют' },
    { icon: Shield, value: '24', label: 'Врача в команде' }
  ];

  const handleBookAppointment = (doctor, e) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Запись на прием к врачу ${doctor.name}\nСпециализация: ${doctor.position}\nБлижайшее время: ${doctor.nextAvailable}\nМы свяжемся с вами для подтверждения записи.`);
  };

  const handleDoctorCardClick = (doctorId, e) => {
    // Если клик был по кнопке записи, не переходим по ссылке
    if (e.target.closest('.book-consultation-btn')) {
      return;
    }
    // Иначе React Router сам обработает переход по <Link>
  };

  useEffect(() => {
    fetchClinicCategories();
    fetchFilteredDoctors();
  }, []);

  useEffect(() => {
    fetchFilteredDoctors(searchQuery, Number.isNaN(+selectedSpecialty) ? undefined : +selectedSpecialty);
  }, [searchQuery, selectedSpecialty]);

  return (
    <div className="doctors-page">

      {/* Герой-секция */}
      <section className="doctors-hero">
        <div className="doctors-container">
          <div className="doctors-header">
            <div className="doctors-tag">
              <div className="doctors-tag-dot"></div>
              НАША КОМАНДА
            </div>
            <h1 className="doctors-title">
              Наши <span className="doctors-title-highlight">врачи</span>
            </h1>
            <p className="doctors-description">
              Профессиональные врачи с многолетним опытом работы. 
              Мы собрали команду лучших специалистов для вашего здоровья.
            </p>
          </div>

          {/* Поиск */}
          <div className="doctors-search-section">
            <div className="search-wrapper">
              <Search size={20} />
              <input
                type="text"
                placeholder="Поиск врача по имени или специализации..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="search-results-info">
              Найдено <span>{filteredDoctors.length}</span> врачей
            </div>
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section className="doctors-stats-section">
        <div className="doctors-container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon-wrapper">
                  <stat.icon size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Специализации */}
      <section className="doctors-specialties-section">
        <div className="doctors-container">
          <div className="section-header">
            <h2>Специализации</h2>
            <p>Выберите направление медицины</p>
          </div>
          
          <div className="specialties-grid">
            <button
                className={`specialty-card ${selectedSpecialty === 'all' ? 'selected' : ''}`}
                onClick={() => setSelectedSpecialty('all')}
                style={{ '--specialty-color': serviceCategoryIcon('all')[1] }}
            >
              <div className="specialty-icon-wrapper">
                <div className="specialty-icon">
                  {serviceCategoryIcon('all')[0]}
                </div>
              </div>
              <div className="specialty-info">
                <span className="specialty-name">Все врачи</span>
                <span className="specialty-count">{allDoctors} врачей</span>
              </div>
            </button>
            {Object.keys(clinicCategories).map((category) => (
              <button
                key={category}
                className={`specialty-card ${selectedSpecialty === category ? 'selected' : ''}`}
                onClick={() => setSelectedSpecialty(category)}
                style={{ '--specialty-color': serviceCategoryIcon(clinicCategories[category].name)[1] }}
              >
                <div className="specialty-icon-wrapper">
                  <div className="specialty-icon">
                    {serviceCategoryIcon(clinicCategories[category].name)[0]}
                  </div>
                </div>
                <div className="specialty-info">
                  <span className="specialty-name">{clinicCategories[category].clinicLocaleName}</span>
                  <span className="specialty-count">{clinicCategories[category].doctorCnt} врачей</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Список врачей */}
      <section className="doctors-list-section">
        <div className="doctors-container">
          <div className="section-header">
            <div>
              <h2>Наши врачи</h2>
              <p>Выберите врача для записи на консультацию</p>
            </div>
            <div className="sort-options">
              <span className="sort-label">Найдено:</span>
              <span className="sort-count">{filteredDoctors.length} врачей</span>
            </div>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="no-results-card">
              <div className="no-results-icon">
                <User size={48} />
              </div>
              <h3>Врачи не найдены</h3>
              <p>Попробуйте изменить поисковый запрос или выбрать другую специализацию.</p>
            </div>
          ) : (
            <div className="doctors-grid">
              {filteredDoctors.map((doctor) => (
                <Link 
                  key={doctor.id}
                  to={`/doctors/${doctor.id}`}
                  className="doctor-card-link"
                  onClick={(e) => handleDoctorCardClick(doctor.id, e)}
                >
                  <div 
                    className={`doctor-card ${doctor.competencies ? 'featured' : ''}`}
                  >
                    {doctor.competencies && (
                      <div className="featured-badge">
                        <Sparkles size={12} />
                        <span>Рекомендуем</span>
                      </div>
                    )}
                    
                    <div className="doctor-card-header">
                      <div className="doctor-avatar" style={{ backgroundColor: doctor.imageColor }}>
                        <User size={32} color="white" />
                      </div>
                      <div className="doctor-header-info">
                        <h3 className="doctor-name">{doctor.fullName}</h3>
                        <p className="doctor-position">{doctor.position}</p>
                        <div className="doctor-rating">
                          <Star size={14} />
                          <span className="rating-value">{doctor.rating}</span>
                          <span className="rating-reviews">({(doctor.doctorReviews || []).length} отзывов)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="doctor-specialty-badge">
                      {doctor.clinicType?.name ?? '—'}
                    </div>
                    
                    <p className="doctor-description">{doctor.description ?? doctor.position ?? ''}</p>
                    
                    <div className="doctor-details">
                      <div className="doctor-detail">
                        <Clock size={16} />
                        <span>{doctor.experience ?? 0} лет опыта</span>
                      </div>
                      <div className="doctor-detail">
                        <Calendar size={16} />
                        <span>{(doctor.dayWork?.days || []).join(', ')}, {doctor.scheduleWork ?? ''}</span>
                      </div>
                    </div>
                    
                    <div className="doctor-services">
                      {(doctor.competencies || []).slice(0, 3).map((service, index) => (
                        <div key={index} className="service-item">
                          <Check size={12} />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="doctor-card-footer">
                      <div className="doctor-price">
                        <span className="price-label">Консультация</span>
                        <span className="price-value">{doctor.consultPrice} ₽</span>
                      </div>
                      <button 
                        className="book-consultation-btn"
                        onClick={(e) => handleBookAppointment(doctor, e)}
                      >
                        <Calendar size={16} />
                        <span>Записаться</span>
                      </button>
                    </div>
                    
                    <div className="doctor-card-view-link">
                      <span>Подробнее о враче</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="doctors-cta-section">
        <div className="doctors-container">
          <div className="cta-content">
            <h2>Нужна помощь с выбором врача?</h2>
            <p>Наши координаторы помогут подобрать подходящего специалиста под ваши потребности</p>
            <div className="cta-buttons">
              <Link to="/contacts" className="cta-btn secondary">
                <Phone size={18} />
                <span>Контакты</span>
              </Link>
              <Link to="/consultations" className="cta-btn primary">
                <Calendar size={18} />
                <span>Бесплатная консультация</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorsPage;