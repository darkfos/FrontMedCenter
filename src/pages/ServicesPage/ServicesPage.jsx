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
} from 'lucide-react';

import { ClinicAPI} from "../../api/clinic";
import { debounce } from "../../utils/debounce";
import './ServicesPage.css';

const ServicesPage = () => {
  const [clinicCategories, setClinicCategories] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
  };

  const handleBookService = () => {
    alert(`Вы выбрали услугу: ${selectedService.name}\nСтоимость: ${selectedService.price}\nНаправляем вас к записи на прием...`);
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
                      <span>{service.doctors.length} специалист{service.doctors.length === 1 ? '' : 'а'}</span>
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
        <div className="service-modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="service-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-content">
                <h2>{selectedService.title}</h2>
                <p className="modal-category">
                  {selectedService.clinicType.name}
                </p>
              </div>
              <button 
                className="modal-close"
                onClick={() => setSelectedService(null)}
              >
                <Cross size={24} />
              </button>
            </div>
            
            <div className="modal-content">
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
                    {selectedService.includesIn.map((feature, index) => (
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
                    {selectedService.specialists.map((specialist, index) => (
                      <span key={index} className="specialist-tag">
                        {specialist}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="modal-rating">
                  <div className="rating-value">
                    <Star size={20} />
                    <span>{selectedService.rating}</span>
                    <span className="rating-label">рейтинг</span>
                  </div>
                  <div className="rating-popularity">
                    <span>{Number(selectedCategory.recLike > 0 ? selectedCategory.recLike : 90) / Number(selectedCategory.recDeslike > 0 ? selectedCategory.resDeslike : 1)}%</span>
                    <span className="popularity-label">пациентов рекомендуют</span>
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="modal-back-button"
                  onClick={() => setSelectedService(null)}
                >
                  Назад к списку
                </button>
                <button 
                  className="modal-book-button"
                  onClick={handleBookService}
                >
                  <Calendar size={18} />
                  <span>Записаться на услугу</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;