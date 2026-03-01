import React, { useState } from 'react';
import { User, Phone, Plus, Calendar, ChevronRight } from 'lucide-react';
import { useForm, Controller } from "react-hook-form";

import { ConsultAPI} from "../../api/consult";
import './HeroSection.css';

const HeroSection = () => {

  const { control, handleSubmit, register, setError, formState: { errors } } = useForm();
  const [isSaveConsult, setIsSaveConsult] = useState(false);

  const handleSubmitConsultForm = async (data) => {
      const result = await ConsultAPI.createConsult(data.username, data.phone, data.complaints);

      if (Array.isArray(result)) {
        return result.forEach(errorField => (
            setError(errorField, { message: 'Неверно заполненное поле' })
        ))
      }

      setIsSaveConsult(true);
  };

  return (
    <div className="hero-section">
      <div className="hero-wrapper">
        <div className="hero-content-row">
          <div className="hero-left-column">
            <div className="hero-content-wrapper">
              <div className="hero-tag">
                <div className="tag-dot"></div>
                Традиционная медицина с заботой
              </div>

              <h1 className="hero-title">
                Здоровье —<br />
                <span className="hero-highlight">наша общая цель</span>
              </h1>

              <p className="hero-description">
                Мы сочетаем проверенные методы традиционной медицины с современными 
                технологиями, предлагая комплексный подход к вашему здоровью.
              </p>

              <div className="hero-cta-section">
                <h2 className="cta-title">Бесплатная консультация</h2>
                <div className="hero-buttons">
                  <button className="hero-button-primary">
                    <Calendar size={18} />
                    Бесплатная консультация
                  </button>
                  <button className="hero-button-secondary">
                    Узнать о подходе
                    <ChevronRight size={16} className="button-chevron-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-right-column">
            <div className="hero-form-container">
              <h2 className="hero-form-title">Первичная консультация</h2>
              <p className="hero-form-subtitle">Бесплатно • 45 минут • Онлайн или в клинике</p>

              <form className="hero-form" onSubmit={handleSubmit(handleSubmitConsultForm)}>
                <div className="hero-input-group">
                  <div className="hero-input-icon-wrapper">
                    <User size={18} color="#10b981" />
                  </div>
                  <Controller
                    name="username"
                    control={control}
                    rules={{ required: { value: true, message: 'Пропущено обязательное поле' }}}
                    render={({ field }) => (
                        <div>
                          <input
                              type="text"
                              placeholder="Ваше имя"
                              className="hero-input"
                              {...field}
                          />
                          { errors.username && (
                              <span className='form_field__error'>{errors.username.message}</span>
                          )}
                        </div>
                    ) }
                  />
                </div>

                <div className="hero-input-group">
                  <div className="hero-input-icon-wrapper">
                    <Phone size={18} color="#10b981" />
                  </div>
                  <Controller
                      render={({ field }) => (
                          <div>
                            <input
                                type="tel"
                                placeholder="Номер телефона"
                                className="hero-input"
                                {...field}
                            />
                            { errors.phone && (
                                <span className='form_field__error'>{errors.phone.message}</span>
                            )}
                          </div>
                      )}
                      name="phone"
                      control={control}
                  />
                </div>

                <div className="hero-textarea-group">
                  <div className="hero-textarea-icon">
                    <Plus size={18} color="#64748b" />
                  </div>
                  <div className="hero-textarea-wrapper">
                    <label className="hero-textarea-label">Ваши цели здоровья</label>
                    <Controller
                        render={({ field }) => (
                            <div>
                              <textarea
                                  placeholder="Расскажите, что вас беспокоит"
                                  className="hero-textarea"
                                  {...field}
                              />
                              { errors.complaints && (
                                  <span className='form_field__error'>{errors.complaints.message}</span>
                              )}
                            </div>
                        )}
                        name="complaints"
                        control={control}
                    />
                  </div>
                </div>

                {isSaveConsult && (
                    <span className="form_field__success">Запрос на консультацию был отправлен!</span>
                ) }

                <button type="submit" className="hero-submit-button">
                  Записаться на консультацию
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;