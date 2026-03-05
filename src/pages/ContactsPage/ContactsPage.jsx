import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Heart,
  Stethoscope,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import './ContactsPage.css';

const ContactsPage = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const contacts = {
    address: 'ул. Медицинская, д. 15, Москва, 127006',
    phone: '+7 (495) 123-45-67',
    email: 'info@medicare.ru',
    workingHours: 'Пн-Пт: 8:00 - 22:00, Сб-Вс: 9:00 - 20:00',
    emergencyPhone: '+7 (495) 987-65-43'
  };

  const departments = [
    {
      name: 'Терапевтическое отделение',
      phone: '+7 (495) 111-22-33',
      email: 'therapy@medicare.ru',
      hours: '8:00 - 20:00'
    },
    {
      name: 'Хирургическое отделение',
      phone: '+7 (495) 222-33-44',
      email: 'surgery@medicare.ru',
      hours: '9:00 - 18:00'
    },
    {
      name: 'Педиатрическое отделение',
      phone: '+7 (495) 333-44-55',
      email: 'pediatrics@medicare.ru',
      hours: '8:00 - 21:00'
    },
    {
      name: 'Стоматологическое отделение',
      phone: '+7 (495) 444-55-66',
      email: 'dentistry@medicare.ru',
      hours: '9:00 - 19:00'
    }
  ];

  const faqItems = [
    {
      question: 'Как записаться на прием к врачу?',
      answer: 'Вы можете записаться на прием по телефону +7 (495) 123-45-67, через форму онлайн-записи на нашем сайте или лично посетив регистратуру медицинского центра. Для записи онлайн потребуется указать ваши контактные данные и выбрать удобное время.'
    },
    {
      question: 'Какие документы нужны для первичного приема?',
      answer: 'При первом посещении необходимо иметь при себе паспорт, полис ОМС (при наличии) и СНИЛС. Если у вас есть результаты предыдущих обследований или выписки из других медицинских учреждений, рекомендуем взять их с собой.'
    },
    {
      question: 'Работаете ли вы по полисам ДМС?',
      answer: 'Да, мы сотрудничаем с большинством страховых компаний. Пожалуйста, уточните у вашей страховой компании, входит ли наш медицинский центр в список партнеров, и принесите полис ДМС с паспортом на первый прием.'
    },
    {
      question: 'Можно ли вызвать врача на дом?',
      answer: 'Да, мы предоставляем услугу вызова врача на дом. Услуга доступна для жителей Москвы в пределах МКАД. Для вызова врача на дом позвоните по телефону +7 (495) 123-45-67 и предоставьте необходимую информацию о пациенте и адресе.'
    },
    {
      question: 'Как узнать стоимость услуг?',
      answer: 'Полный прайс-лист услуг доступен на нашем сайте в разделе "Услуги и цены". Вы также можете уточнить стоимость конкретной услуги по телефону регистратуры. Для комплексных обследований и программ проводится индивидуальный расчет.'
    },
    {
      question: 'Есть ли у вас услуги для иностранных граждан?',
      answer: 'Да, мы оказываем медицинскую помощь иностранным гражданам. Прием ведется на русском и английском языках. Для оформления медицинской документации может потребоваться перевод паспорта. Все услуги для иностранных граждан предоставляются на платной основе.'
    }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="contacts-page">
      <div className="contacts-bg-shapes">
        <div className="contacts-circle contacts-circle1"></div>
        <div className="contacts-circle contacts-circle2"></div>
        <div className="contacts-circle contacts-circle3"></div>
        <div className="contacts-circle contacts-circle4"></div>
      </div>

      <section className="contacts-section">
        <div className="contacts-container">
          <div className="contacts-header">
            <div className="contacts-tag">
              <div className="contacts-tag-dot"></div>
              КОНТАКТЫ
            </div>
            <h1 className="contacts-title">
              Свяжитесь с нами
              <span className="contacts-title-highlight">MediCare</span>
            </h1>
            <p className="contacts-description">
              Мы всегда готовы ответить на ваши вопросы и помочь записаться на прием. 
              Выберите удобный способ связи или посетите наш медицинский центр.
            </p>
          </div>

          <div className="contacts-content">
            <div className="contacts-grid">
              <div className="contacts-info-section">
                <div className="contacts-info-card">
                  <h2 className="contacts-info-title">
                    <Phone size={20} />
                    Контактная информация
                  </h2>
                  
                  <div className="contacts-info-list">
                    <div className="contacts-info-item">
                      <div className="contacts-info-icon">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <div className="contacts-info-label">Адрес</div>
                        <div className="contacts-info-value">{contacts.address}</div>
                      </div>
                    </div>

                    <div className="contacts-info-item">
                      <div className="contacts-info-icon">
                        <Phone size={20} />
                      </div>
                      <div>
                        <div className="contacts-info-label">Телефон</div>
                        <div className="contacts-info-value">
                          <a href={`tel:${contacts.phone}`} className="contacts-link">
                            {contacts.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="contacts-info-item">
                      <div className="contacts-info-icon">
                        <Mail size={20} />
                      </div>
                      <div>
                        <div className="contacts-info-label">Email</div>
                        <div className="contacts-info-value">
                          <a href={`mailto:${contacts.email}`} className="contacts-link">
                            {contacts.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="contacts-info-item">
                      <div className="contacts-info-icon">
                        <Clock size={20} />
                      </div>
                      <div>
                        <div className="contacts-info-label">Часы работы</div>
                        <div className="contacts-info-value">{contacts.workingHours}</div>
                      </div>
                    </div>

                    <div className="contacts-info-item contacts-emergency">
                      <div className="contacts-info-icon">
                        <Heart size={20} />
                      </div>
                      <div>
                        <div className="contacts-info-label">Неотложная помощь</div>
                        <div className="contacts-info-value contacts-emergency-phone">
                          <a href={`tel:${contacts.emergencyPhone}`} className="contacts-emergency-link">
                            {contacts.emergencyPhone}
                          </a>
                        </div>
                        <div className="contacts-emergency-note">Круглосуточно</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Отделения */}
                <div className="contacts-departments">
                  <h3 className="contacts-section-title">
                    <Stethoscope size={18} />
                    Отделения
                  </h3>
                  <div className="departments-list">
                    {departments.map((dept, index) => (
                      <div key={index} className="department-item">
                        <div className="department-name">{dept.name}</div>
                        <div className="department-info">
                          <div className="department-phone">
                            <Phone size={14} />
                            <a href={`tel:${dept.phone}`}>{dept.phone}</a>
                          </div>
                          <div className="department-hours">
                            <Clock size={14} />
                            {dept.hours}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="contacts-map-section">
                <div className="contacts-map-container">
                  <div className="contacts-map">
                    <div className="map-placeholder">
                      <MapPin size={48} color="#10b981" />
                      <div className="map-placeholder-text">
                        <h3>Медицинский центр MediCare</h3>
                        <p>ул. Медицинская, д. 15, Москва</p>
                      </div>
                    </div>
                  </div>
                  <div className="map-instructions">
                    <p>Используйте навигатор для построения маршрута</p>
                    <a 
                      href="https://yandex.ru/maps" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="map-link"
                    >
                      Построить маршрут в Яндекс.Картах →
                    </a>
                  </div>
                </div>

                {/* Секция с часто задаваемыми вопросами */}
                <div className="contacts-faq-section">
                  <h3 className="contacts-section-title">
                    <HelpCircle size={18} />
                    Часто задаваемые вопросы
                  </h3>
                  <div className="faq-list">
                    {faqItems.map((item, index) => (
                      <div 
                        key={index} 
                        className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}
                        onClick={() => toggleFaq(index)}
                      >
                        <div className="faq-question">
                          <div className="faq-question-content">
                            <span className="faq-number">0{index + 1}</span>
                            <span className="faq-text">{item.question}</span>
                          </div>
                          <div className="faq-icon">
                            {expandedFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>
                        {expandedFaq === index && (
                          <div className="faq-answer">
                            <p>{item.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="contacts-notes">
              <div className="note-card">
                <div className="note-icon">
                  <Heart size={24} />
                </div>
                <div className="note-content">
                  <h3>Ваше здоровье — наш приоритет</h3>
                  <p>
                    Медицинский центр MediCare предоставляет полный спектр медицинских услуг 
                    в соответствии с международными стандартами качества. Все наши специалисты 
                    имеют высокую квалификацию и регулярно проходят повышение квалификации.
                  </p>
                </div>
              </div>

              <div className="note-card">
                <div className="note-icon">
                  <Shield size={24} />
                </div>
                <div className="note-content">
                  <h3>Официальный сайт</h3>
                  <p>
                    Вся актуальная информация о наших услугах, врачах и ценах доступна на официальном сайте. 
                    Для получения информации звоните по телефону или посетите наш сайт.
                  </p>
                  <div className="website-link">
                    <a href="https://medicare.com.ru" target="_blank" rel="noopener noreferrer">
                      medicare.com.ru
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactsPage;