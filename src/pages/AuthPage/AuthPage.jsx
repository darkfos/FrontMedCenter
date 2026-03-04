import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Shield,
  LockKeyhole,
  Check,
  MailIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthAPI } from '../../api/auth';
import './AuthPage.css';

const getErrorMessage = (error) => {
  const data = error?.response?.data;
  if (typeof data?.message === 'string') return data.message;
  if (Array.isArray(data)) return data.join(', ');
  if (data?.detail) return typeof data.detail === 'string' ? data.detail : 'Ошибка валидации';
  return error?.message || 'Произошла ошибка. Попробуйте позже.';
};

const AuthPage = () => {
  const navigate = useNavigate();

  const { login, currentUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [successResetPassword, setSuccessResetPassword] = useState('');

  const { control: resetPasswordControl, handleSubmit: handleSubmitResetPasswordForm } = useForm();

  React.useEffect(() => {
    if (currentUser) {
      navigate('/profile');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      if (!isLogin) {
        const formData = new FormData(e.target);
        const firstName = (formData.get('firstName') || '').trim();
        const lastName = (formData.get('lastName') || '').trim();
        const fullName = [firstName, lastName].filter(Boolean).join(' ');
        const email = (formData.get('email') || '').trim();
        const phone = (formData.get('phone') || '').trim();
        const password = formData.get('password') || '';
        const confirmPassword = formData.get('confirmPassword') || '';

        if (password !== confirmPassword) {
          setErrorMessage('Пароли не совпадают');
          return;
        }
        if (!fullName) {
          setErrorMessage('Введите имя и фамилию');
          return;
        }

        await AuthAPI.register({
          email,
          password,
          fullName,
          phone: phone || undefined,
        });
        setErrorMessage('');
        setIsLogin(true);
        setErrorMessage('Регистрация прошла успешно. Войдите в аккаунт.');
        return;
      }

      const formData = new FormData(e.target);
      const email = (formData.get('email') || '').trim();
      const password = formData.get('password') || '';

      if (!email || !password) {
        setErrorMessage('Введите email и пароль');
        return;
      }

      const tokens = await AuthAPI.login({ email, password });
      const token = tokens?.token ?? tokens?.accessToken;
      const refresh = tokens?.refresh ?? tokens?.refreshToken;
      if (!token) {
        setErrorMessage('Не удалось аутентифицировать пользователя');
        return;
      }
      localStorage.setItem('token', token);
      if (refresh) localStorage.setItem('refresh', refresh);

      const user = await AuthAPI.getUserInfo();
      login({ token, refresh }, user);
      setErrorMessage('');
      navigate('/profile');
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitResetPassword = async (data) => {
    setErrorMessage('');
    setSubmitting(true);

    if (data.password !== data.confirmPassword) {
      setErrorMessage('Пароли не совпадают');
    }

    if (data.password.length < 6) {
      setErrorMessage('Пароль должен быть не менее 6 символов');
    }

    const req = await AuthAPI.changeUnsignedPassword(data.email, data.password);
    console.log(req);
    if (req.message === 'Пароль успешно изменён') {
      setSubmitting(false);
      setResetPassword(false);
      setSuccessResetPassword(req.message);
    } else {
      return setErrorMessage('Пароль успешно изменен');
    }

  };

  if (resetPassword) {
    return (
      <div className="auth-page">
      <div className="auth-bg-shapes">
        <div className="auth-circle auth-circle1"></div>
        <div className="auth-circle auth-circle2"></div>
        <div className="auth-circle auth-circle3"></div>
        <div className="auth-circle auth-circle4"></div>
      </div>

      <section className="auth-section">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="auth-title">
              Добро пожаловать в
              <span className="auth-title-highlight">MediCare</span>
            </h1>
            <p className="auth-description">
              Восстановление пароля
            </p>
          </div>

          <div className="auth-card" style={{ maxWidth: '680px', margin: '0 auto' }}>

            {/* Сообщение об ошибке или успехе */}
            {errorMessage && (
              <div className={`auth-error-message ${errorMessage.includes('успешно') ? 'auth-success-message' : ''}`}>
                {errorMessage}
              </div>
            )}

            {successResetPassword && (
              <div className="auth-success-message">
                {successResetPassword}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmitResetPasswordForm(handleSubmitResetPassword)}>
                <div style={{ width: '100%'}}>
                  <div className="auth-form-section" style={{ width: '100%' }}>
                    <h2 className="auth-section-title">Восстановление пароля</h2>
                    <p className="auth-section-subtitle">Введите ваш новый пароль</p>

                    <div className="auth-name-group" style={{ flexDirection: 'column', display: 'flex', alignItems: 'center', width: '100%' }}>
                      <div className="auth-input-group" style={{ width: '100%' }}>
                          <label className="auth-label">Email</label>
                          <div className="auth-input-wrapper" style={{ width: '100%' }}>
                            <Controller 
                              control={resetPasswordControl}
                              name='email'
                              rules={{ required: true }}
                              render={({ field }) => (
                                <div className="auth-input-wrapper" style={{ width: '100%' }}>
                                  <MailIcon size={18} className="auth-input-icon" />
                                  <input type="email" {...field} placeholder="Ваша электронная почта" className="auth-input" required  style={{ width: '100%' }} />
                                </div>
                              )}
                            />
                          </div>
                        </div>
                      <div className="auth-input-group" style={{ width: '100%' }}>
                        <label className="auth-label">Пароль</label>
                        <div className="auth-input-wrapper" style={{ width: '100%' }}>
                          <Controller 
                            control={resetPasswordControl}
                            name='password'
                            rules={{ required: true }}
                            render={({ field }) => (
                              <div className="auth-input-wrapper" style={{ width: '100%' }}>
                                <LockKeyhole size={18} className="auth-input-icon" />
                                <input type="password" {...field} placeholder="Ваше новый пароль" className="auth-input" required  style={{ width: '100%' }} />
                              </div>
                            )}
                          />
                        </div>
                      </div>
                      <div className="auth-input-group" style={{ width: '100%' }}>
                        <label className="auth-label">Повторите пароль</label>
                        <div className="auth-input-wrapper" style={{ width: '100%' }}>
                          <Controller 
                            control={resetPasswordControl}
                            name='confirmPassword'
                            rules={{ required: true }}
                            render={({ field }) => (
                              <div className="auth-input-wrapper" style={{ width: '100%' }}>
                                <LockKeyhole size={18} className="auth-input-icon" />
                                <input type="password" {...field} placeholder="Повторите ваш новый пароль" style={{ width: '100%' }} className="auth-input" required />
                              </div>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      className="auth-submit-button"
                      type="submit"
                    >
                      Вход
                    </button>
                  </div>
                </div>
            </form>
          </div>
        </div>
      </section>
    </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-shapes">
        <div className="auth-circle auth-circle1"></div>
        <div className="auth-circle auth-circle2"></div>
        <div className="auth-circle auth-circle3"></div>
        <div className="auth-circle auth-circle4"></div>
      </div>

      <section className="auth-section">
        <div className="auth-container">
          <div className="auth-header">
            <div className="auth-tag">
              <div className="auth-tag-dot"></div>
              {isLogin ? 'ВХОД В АККАУНТ' : 'СОЗДАНИЕ АККАУНТА'}
            </div>
            <h1 className="auth-title">
              Добро пожаловать в
              <span className="auth-title-highlight">MediCare</span>
            </h1>
            <p className="auth-description">
              {isLogin 
                ? 'Войдите в личный кабинет для управления вашим здоровьем и записями на приемы'
                : 'Создайте личный кабинет для управления вашим здоровьем, записью на приемы и доступом к персональному плану лечения.'}
            </p>
          </div>

          <div className="auth-card">
            <div className="auth-mode-toggle">
              <button
                className={`auth-mode-button ${!isLogin ? 'auth-mode-button-active' : ''}`}
                onClick={() => setIsLogin(false)}
                type="button"
              >
                Регистрация
              </button>
              <button
                className={`auth-mode-button ${isLogin ? 'auth-mode-button-active' : ''}`}
                onClick={() => setIsLogin(true)}
                type="button"
              >
                Вход
              </button>
            </div>

            {/* Сообщение об ошибке или успехе */}
            {errorMessage && (
              <div className={`auth-error-message ${errorMessage.includes('успешно') ? 'auth-success-message' : ''}`}>
                {errorMessage}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin ? (
                <div className="auth-grid">
                  <div className="auth-form-section">
                    <h2 className="auth-section-title">Личная информация</h2>
                    <p className="auth-section-subtitle">Ваши базовые данные</p>

                    <div className="auth-name-group">
                      <div className="auth-input-group">
                        <label className="auth-label">Имя</label>
                        <div className="auth-input-wrapper">
                          <User size={18} className="auth-input-icon" />
                          <input 
                            type="text" 
                            name="firstName"
                            placeholder="Ваше имя" 
                            className="auth-input"
                            required 
                          />
                        </div>
                      </div>
                      <div className="auth-input-group">
                        <label className="auth-label">Фамилия</label>
                        <div className="auth-input-wrapper">
                          <User size={18} className="auth-input-icon" />
                          <input 
                            type="text" 
                            name="lastName"
                            placeholder="Ваша фамилия" 
                            className="auth-input"
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <label className="auth-label">Email</label>
                      <div className="auth-input-wrapper">
                        <Mail size={18} className="auth-input-icon" />
                        <input 
                          type="email" 
                          name="email"
                          placeholder="your@email.com" 
                          className="auth-input"
                          required 
                        />
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <label className="auth-label">Телефон</label>
                      <div className="auth-input-wrapper">
                        <Phone size={18} className="auth-input-icon" />
                        <input 
                          type="tel" 
                          name="phone"
                          placeholder="+7 (___) ___-__-__" 
                          className="auth-input"
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Аккаунт и безопасность */}
                  <div className="auth-form-section">
                    <h2 className="auth-section-title">Аккаунт и безопасность</h2>
                    <p className="auth-section-subtitle">Защита ваших данных</p>

                    <div className="auth-input-group">
                      <label className="auth-label">Пароль</label>
                      <div className="auth-input-wrapper">
                        <Lock size={18} className="auth-input-icon" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="••••••••"
                          className="auth-input"
                          required
                          minLength="6"
                        />
                        <button
                          type="button"
                          className="auth-password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <label className="auth-label">Подтвердите пароль</label>
                      <div className="auth-input-wrapper">
                        <Check size={18} className="auth-input-icon" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="••••••••"
                          className="auth-input"
                          required
                          minLength="6"
                        />
                        <button
                          type="button"
                          className="auth-password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="auth-security-box">
                      <Shield size={20} className="auth-security-icon" />
                      <div>
                        <div className="auth-security-title">Безопасность данных</div>
                        <div className="auth-security-text">
                          Ваши персональные и медицинские данные защищены согласно законодательству о защите персональных данных
                        </div>
                      </div>
                    </div>

                    <div className="auth-checkbox">
                      <input type="checkbox" id="terms" required className="auth-checkbox-input" />
                      <label htmlFor="terms" className="auth-checkbox-label">
                        Я согласен с{' '}
                        <Link to="/terms" className="auth-agreement-link">
                          условиями использования
                        </Link>{' '}
                        и{' '}
                        <Link to="/privacy" className="auth-agreement-link">
                          политикой конфиденциальности
                        </Link>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="auth-login-form">
                  <div className="auth-input-group">
                    <label className="auth-label">Email</label>
                    <div className="auth-input-wrapper">
                      <Mail size={18} className="auth-input-icon" />
                      <input 
                        type="email" 
                        name="email"
                        placeholder="your@email.com" 
                        className="auth-input"
                        required 
                      />
                    </div>
                  </div>

                  <div className="auth-input-group">
                    <label className="auth-label">Пароль</label>
                    <div className="auth-input-wrapper">
                      <Lock size={18} className="auth-input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="••••••••"
                        className="auth-input"
                        required
                      />
                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="auth-forgot-password">
                    <button type="button" className="auth-forgot-link" onClick={() => setResetPassword(true)}>
                      Забыли пароль?
                    </button>
                  </div>
                </div>
              )}

              <div className="auth-divider"></div>

              <button type="submit" className="auth-submit-button" disabled={submitting}>
                {submitting ? 'Отправка...' : (isLogin ? 'Войти в аккаунт' : 'Создать аккаунт и начать путь к здоровью')}
              </button>

              <div className="auth-switch-mode">
                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                <button
                  type="button"
                  className="auth-switch-link"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Зарегистрируйтесь' : 'Войти'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthPage;