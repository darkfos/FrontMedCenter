import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart,
  Users,
  Award,
  Shield,
  Target,
  Clock,
  Star,
  Stethoscope,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  BookOpen,
  GraduationCap,
  Briefcase,
  HeartHandshake
} from 'lucide-react';
import './AboutPage.css';
import {DoctorAPI} from "../../api/doctor";

const AboutPage = () => {

  const [doctors, setDoctors] = useState([]);

  const values = [
    {
      icon: Heart,
      title: 'Забота и внимание',
      description: 'Индивидуальный подход к каждому пациенту'
    },
    {
      icon: Shield,
      title: 'Надежность',
      description: 'Проверенные временем методы лечения'
    },
    {
      icon: Target,
      title: 'Точность диагностики',
      description: 'Тщательное обследование и точный диагноз'
    },
    {
      icon: Stethoscope,
      title: 'Профессионализм',
      description: 'Врачи с многолетним опытом работы'
    },
    {
      icon: Users,
      title: 'Семейный подход',
      description: 'Медицина для всей семьи'
    },
    {
      icon: HeartHandshake,
      title: 'Доверие',
      description: 'Доверительные отношения с пациентами'
    }
  ];

  const milestones = [
    { year: '1995', title: 'Основание клиники', description: 'Открытие первой поликлиники MediCare' },
    { year: '2000', title: 'Расширение услуг', description: 'Добавление стационарного отделения' },
    { year: '2005', title: 'Семейная медицина', description: 'Введение семейного врачебного обслуживания' },
    { year: '2010', title: 'Модернизация', description: 'Оснащение современным диагностическим оборудованием' },
    { year: '2015', title: 'Юбилей', description: '20 лет заботы о здоровье пациентов' },
    { year: '2023', title: 'Признание', description: 'Награда "Лучшая клиника традиционной медицины"' }
  ];

  const stats = [
    { icon: Users, value: '50,000+', label: 'Постоянных пациентов' },
    { icon: Award, value: '45+', label: 'Квалифицированных врачей' },
    { icon: Clock, value: '28', label: 'Лет на рынке' },
    { icon: Star, value: '99%', label: 'Довольных пациентов' }
  ];

  useEffect(() => {
    DoctorAPI.getOldestDoctors().then(data => {
      setDoctors(data);
    })
  }, []);

  return (
    <div className="about-page-wrapper">
      <section className="about-hero-section">
        <div className="about-container-main">
          
          <div className="about-hero-content">
            <div className="about-hero-text">
              <div className="about-hero-tag">
                <Stethoscope size={16} />
                <span>Клиника MediCare</span>
              </div>
              <h1 className="about-hero-title">
                Традиционная медицина с <span className="about-gradient-text">заботой</span>
              </h1>
              <p className="about-hero-description">
                С 1995 года мы предоставляем качественные медицинские услуги, 
                сочетая проверенные временем методы с современными технологиями. 
                Наша философия — индивидуальный подход и внимательное отношение к каждому пациенту.
              </p>
              
              <div className="about-hero-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="about-stat-item">
                    <div className="about-stat-icon">
                      <stat.icon size={24} />
                    </div>
                    <div className="about-stat-content">
                      <div className="about-stat-value">{stat.value}</div>
                      <div className="about-stat-label">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="about-hero-image">
              <div className="about-image-wrapper">
                <img 
                  src="https://thumbs.dreamstime.com/b/%D0%B2%D1%80%D0%B0%D1%87-%D0%BF%D0%BE%D1%81%D0%B5%D1%89%D0%B0%D1%8E%D1%89%D0%B8%D0%B9-%D1%81%D1%82%D0%B0%D1%80%D1%88%D0%B5%D0%B3%D0%BE-%D0%BF%D0%B0%D1%86%D0%B8%D0%B5%D0%BD%D1%82%D0%B0-%D0%BD%D0%B0-%D0%B8%D0%B7%D0%BE%D0%BB%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D0%BE%D0%B9-%D0%B8%D0%BB%D0%BB%D1%8E%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8-253261169.jpg" 
                  alt="Клиника MediCare" 
                />
                <div className="about-image-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-story-section">
        <div className="about-container-main">
          <div className="about-section-header">
            <div className="about-section-tag">
              <BookOpen size={16} />
              <span>Наша история</span>
            </div>
            <h2 className="about-section-title">Более 28 лет заботы о здоровье</h2>
            <p className="about-section-subtitle">
              С 1995 года мы помогаем пациентам сохранять и восстанавливать здоровье
            </p>
          </div>
          
          <div className="about-timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="about-milestone">
                <div className="about-milestone-year">{milestone.year}</div>
                <div className="about-milestone-content">
                  <h3 className="about-milestone-title">{milestone.title}</h3>
                  <p className="about-milestone-description">{milestone.description}</p>
                </div>
                {index < milestones.length - 1 && (
                  <div className="about-timeline-line"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-values-section">
        <div className="about-container-main">
          <div className="about-section-header">
            <div className="about-section-tag">
              <Heart size={16} />
              <span>Наши принципы</span>
            </div>
            <h2 className="about-section-title">Основа нашей работы</h2>
            <p className="about-section-subtitle">
              Ценности, которые руководят нами в ежедневной работе с пациентами
            </p>
          </div>
          
          <div className="about-values-grid">
            {values.map((value, index) => (
              <div key={index} className="about-value-card">
                <div className="about-value-icon">
                  <value.icon size={32} />
                </div>
                <h3 className="about-value-title">{value.title}</h3>
                <p className="about-value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-team-section">
        <div className="about-container-main">
          <div className="about-section-header">
            <div className="about-section-tag">
              <Users size={16} />
              <span>Наши врачи</span>
            </div>
            <h2 className="about-section-title">Опытные специалисты</h2>
            <p className="about-section-subtitle">
              Врачи с многолетней практикой и классическим подходом к лечению
            </p>
          </div>
          
          <div className="about-team-grid">
            {doctors.map((member) => (
              <div key={member.id} className="about-team-card">
                <div className="about-member-image">
                  <img src={'/stats/images/'.concat(member.avatar)} alt={member.fullName} />
                  <div className="about-member-overlay">
                    <div className="about-experience-badge">
                      <Calendar size={12} />
                      <span>{member.experience} лет</span>
                    </div>
                  </div>
                </div>
                <div className="about-member-info">
                  <h3 className="about-member-name">{member.fullName}</h3>
                  <div className="about-member-position">{member.position}</div>
                  <div className="about-member-specialty">{member.clinicType.name}</div>
                  <p className="about-member-description">{member.description}</p>
                  
                  <div className="about-member-contact">
                    <div className="about-contact-item">
                      <Mail size={14} />
                      <span>Записаться</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-tech-section">
        <div className="about-container-main">
          <div className="about-tech-content">
            <div className="about-tech-text">
              <div className="about-section-tag">
                <Briefcase size={16} />
                <span>Наш подход</span>
              </div>
              <h2 className="about-tech-title">Классическая медицина с современными технологиями</h2>
              <p className="about-tech-description">
                Мы сочетаем проверенные временем методы лечения с современной диагностикой. 
                Наш подход основан на глубоком понимании традиционной медицины и внимательном отношении к пациентам.
              </p>
              
              <div className="about-tech-features">
                <div className="about-tech-feature">
                  <CheckCircle size={20} />
                  <span>Тщательная диагностика</span>
                </div>
                <div className="about-tech-feature">
                  <CheckCircle size={20} />
                  <span>Индивидуальный план лечения</span>
                </div>
                <div className="about-tech-feature">
                  <CheckCircle size={20} />
                  <span>Последующее наблюдение</span>
                </div>
                <div className="about-tech-feature">
                  <CheckCircle size={20} />
                  <span>Профилактические осмотры</span>
                </div>
              </div>
              
              <Link to="/services" className="about-tech-cta">
                <span>Наши услуги</span>
                <ArrowRight size={18} />
              </Link>
            </div>
            
            <div className="about-tech-visual">
              <div className="about-tech-card">
                <div className="about-tech-icon">
                  <Heart size={32} />
                </div>
                <h3 className="about-tech-card-title">Терапия</h3>
                <p className="about-tech-card-description">Лечение широкого спектра заболеваний</p>
              </div>
              <div className="about-tech-card">
                <div className="about-tech-icon">
                  <Stethoscope size={32} />
                </div>
                <h3 className="about-tech-card-title">Диагностика</h3>
                <p className="about-tech-card-description">Точная постановка диагноза</p>
              </div>
              <div className="about-tech-card">
                <div className="about-tech-icon">
                  <Users size={32} />
                </div>
                <h3 className="about-tech-card-title">Семейная медицина</h3>
                <p className="about-tech-card-description">Забота о здоровье всей семьи</p>
              </div>
              <div className="about-tech-card">
                <div className="about-tech-icon">
                  <Calendar size={32} />
                </div>
                <h3 className="about-tech-card-title">Профилактика</h3>
                <p className="about-tech-card-description">Регулярные осмотры и консультации</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-certificates-section">
        <div className="about-container-main">
          <div className="about-section-header">
            <div className="about-section-tag">
              <Award size={16} />
              <span>Признание</span>
            </div>
            <h2 className="about-section-title">Наши достижения</h2>
            <p className="about-section-subtitle">
              Признание качества наших услуг и доверие пациентов
            </p>
          </div>
          
          <div className="about-certificates-grid">
            <div className="about-certificate-card">
              <div className="about-certificate-icon">
                <Shield size={32} />
              </div>
              <h3 className="about-certificate-title">Лицензия Минздрава</h3>
              <p className="about-certificate-description">Официальная лицензия на медицинскую деятельность</p>
            </div>
            
            <div className="about-certificate-card">
              <div className="about-certificate-icon">
                <Award size={32} />
              </div>
              <h3 className="about-certificate-title">Лучшая клиника</h3>
              <p className="about-certificate-description">В рейтинге частных клиник города</p>
            </div>
            
            <div className="about-certificate-card">
              <div className="about-certificate-icon">
                <GraduationCap size={32} />
              </div>
              <h3 className="about-certificate-title">Образование</h3>
              <p className="about-certificate-description">Врачи с высшим медицинским образованием</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta-section">
        <div className="about-container-main">
          <div className="about-cta-card">
            <div className="about-cta-content">
              <h2 className="about-cta-title">Заботимся о вашем здоровье</h2>
              <p className="about-cta-description">
                Запишитесь на прием к нашим специалистам 
                и получите квалифицированную медицинскую помощь
              </p>
              
              <div className="about-cta-buttons">
                <Link to="/contacts" className="about-cta-btn about-cta-primary">
                  <Phone size={18} />
                  <span>Записаться на прием</span>
                </Link>
                <Link to="/doctors" className="about-cta-btn about-cta-secondary">
                  <Stethoscope size={18} />
                  <span>Выбрать врача</span>
                </Link>
              </div>
            </div>
            
            <div className="about-cta-image">
              <div className="about-cta-decoration"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;