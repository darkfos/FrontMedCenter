import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Stethoscope,
  Activity,
  Settings,
  LogOut,
  Edit2,
  Save,
  Bell,
  Lock,
  Heart,
  X,
  Search,
  Filter,
  Plus,
  FileText,
  ClipboardList,
  Eye,
  EyeOff,
  Pill,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  Download,
  Printer,
  MessageSquare,
  Upload,
  Users,
  FileEdit,
  CreditCard,
  Award,
  TrendingUp,
  BarChart,
  Key,
  BellOff,
  Trash2,
  Edit3,
  History,
  Star,
  ShieldCheck,
  Database,
  Server,
  Network,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthAPI } from '../../api/auth';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updateUser, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(() => ({ ...currentUser }));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [newPrescription, setNewPrescription] = useState({
    medicine: '',
    dosage: '',
    frequency: '',
    duration: '',
    notes: ''
  });
  const [newTest, setNewTest] = useState({
    type: '',
    result: '',
    date: new Date().toISOString().split('T')[0],
    lab: '',
    notes: ''
  });
  const [profileSaveError, setProfileSaveError] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mock данные для пациентов врача
  const [patients, setPatients] = useState([
    {
      id: 1,
      firstName: 'Анна',
      lastName: 'Иванова',
      age: 35,
      phone: '+7 (999) 123-45-67',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-02-20',
      status: 'active',
      complaints: 'Головные боли, усталость',
      prescriptions: [
        {
          id: 1,
          medicine: 'Парацетамол',
          dosage: '500 мг',
          frequency: '3 раза в день',
          duration: '5 дней',
          date: '2024-01-15',
          doctor: 'Доктор Петров'
        }
      ],
      testResults: [
        {
          id: 1,
          type: 'Общий анализ крови',
          result: 'В норме',
          date: '2024-01-10',
          lab: 'Лаборатория №1'
        }
      ],
      medicalHistory: [
        {
          id: 1,
          date: '2023-12-01',
          diagnosis: 'Гипертония',
          doctor: 'Доктор Сидорова',
          notes: 'Назначена диета и ЛФК'
        }
      ],
      attendance: [
        { date: '2024-01-15', status: 'attended' },
        { date: '2023-12-20', status: 'attended' },
        { date: '2023-11-25', status: 'cancelled' }
      ]
    },
    {
      id: 2,
      firstName: 'Сергей',
      lastName: 'Петров',
      age: 42,
      phone: '+7 (999) 234-56-78',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-02-15',
      status: 'active',
      complaints: 'Боль в спине',
      prescriptions: [],
      testResults: [],
      medicalHistory: [],
      attendance: []
    },
    {
      id: 3,
      firstName: 'Мария',
      lastName: 'Сидорова',
      age: 28,
      phone: '+7 (999) 345-67-89',
      lastVisit: '2023-12-20',
      nextAppointment: null,
      status: 'inactive',
      complaints: 'Плановый осмотр',
      prescriptions: [],
      testResults: [],
      medicalHistory: [],
      attendance: []
    }
  ]);

  // Данные для пациента
  const [patientRecords, setPatientRecords] = useState([
    {
      id: 1,
      date: '2024-01-15',
      doctor: 'Доктор Иванов',
      specialty: 'Кардиолог',
      diagnosis: 'Артериальная гипертензия',
      prescription: 'Лозартан 50мг 1 раз в день',
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-01-10',
      doctor: 'Доктор Петрова',
      specialty: 'Невролог',
      diagnosis: 'Мигрень',
      prescription: 'Ибупрофен 200мг при болях',
      status: 'active'
    },
    {
      id: 3,
      date: '2024-02-05',
      doctor: 'Доктор Сидоров',
      specialty: 'Терапевт',
      diagnosis: 'ОРВИ',
      prescription: 'Обильное питье, постельный режим',
      status: 'completed'
    }
  ]);

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      date: '2024-02-20',
      time: '10:00',
      doctor: 'Доктор Иванов',
      specialty: 'Кардиолог',
      room: 'Кабинет 205',
      status: 'confirmed'
    },
    {
      id: 2,
      date: '2024-02-25',
      time: '14:30',
      doctor: 'Доктор Петрова',
      specialty: 'Невролог',
      room: 'Кабинет 312',
      status: 'pending'
    }
  ]);

  // Данные для медсестры
  const [nurseTasks, setNurseTasks] = useState([
    {
      id: 1,
      patient: 'Иванова Анна Сергеевна',
      room: 'Палата 301',
      procedure: 'Измерение давления',
      time: '08:00',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 2,
      patient: 'Петров Сергей Иванович',
      room: 'Палата 205',
      procedure: 'Введение инсулина',
      time: '09:30',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 3,
      patient: 'Сидорова Мария Петровна',
      room: 'Палата 108',
      procedure: 'Перевязка',
      time: '11:00',
      priority: 'medium',
      status: 'completed'
    }
  ]);

  const [inventory, setInventory] = useState([
    { id: 1, item: 'Шприцы 5мл', quantity: 150, threshold: 50 },
    { id: 2, item: 'Перчатки L', quantity: 200, threshold: 100 },
    { id: 3, item: 'Бинты стерильные', quantity: 75, threshold: 50 },
    { id: 4, item: 'Антисептик', quantity: 30, threshold: 20 }
  ]);

  // Данные для администратора
  const [systemStats, setSystemStats] = useState({
    totalUsers: 245,
    activeDoctors: 28,
    activePatients: 187,
    appointmentsToday: 42,
    revenueToday: 125400,
    systemLoad: 67
  });

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      type: 'registration',
      user: 'Козлов Алексей',
      email: 'alex.kozlov@email.com',
      date: '2024-02-15',
      status: 'pending'
    },
    {
      id: 2,
      type: 'access',
      user: 'Доктор Николаев',
      email: 'dr.nikolaev@clinic.com',
      request: 'Доступ к архиву снимков',
      date: '2024-02-14',
      status: 'pending'
    },
    {
      id: 3,
      type: 'equipment',
      user: 'Отдел закупок',
      request: 'Закупка нового УЗИ аппарата',
      amount: 1250000,
      date: '2024-02-13',
      status: 'pending'
    }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'Добавлен новый пациент', user: 'Админ', time: '10:30' },
    { id: 2, action: 'Обновлен график врача', user: 'Доктор Иванов', time: '09:45' },
    { id: 3, action: 'Создан отчет за январь', user: 'Система', time: '08:15' },
    { id: 4, action: 'Изменены настройки безопасности', user: 'Админ', time: 'Вчера 16:20' }
  ]);

  // При каждом переходе на страницу профиля — запрос /info; при 401 interceptor сбросит storage и редирект на /auth
  useEffect(() => {
    refreshUser().catch(() => {});
  }, []);

  useEffect(() => {
    if (currentUser) {
      setUserData({ ...currentUser });
    }
  }, [currentUser]);

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = async () => {
    setProfileSaveError('');
    setProfileSaving(true);
    const fullName = [userData.firstName, userData.lastName].filter(Boolean).join(' ').trim();
    try {
      await AuthAPI.updateProfile({
        fullName: fullName || undefined,
        email: userData.email || undefined,
        phone: userData.phone || undefined,
        policyNumber: userData.policyNumber ?? currentUser.policyNumber ?? undefined,
      });
      const fresh = await refreshUser();
      setUserData((prev) => ({ ...prev, ...fresh }));
      setIsEditing(false);
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.response?.data?.detail ?? err?.message ?? 'Не удалось сохранить данные';
      setProfileSaveError(typeof msg === 'string' ? msg : 'Ошибка сохранения профиля');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCancel = () => {
    setUserData({ ...currentUser });
    setIsEditing(false);
  };

  const openPasswordModal = () => {
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    const pwd = newPassword.trim();
    const conf = confirmPassword.trim();
    if (pwd.length < 6) {
      setPasswordError('Пароль должен быть не менее 6 символов');
      return;
    }
    if (pwd !== conf) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    setPasswordSaving(true);
    try {
      await AuthAPI.changePassword(pwd);
      setPasswordSuccess('Пароль успешно изменён');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => closePasswordModal(), 1500);
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.response?.data?.detail ?? err?.message ?? 'Не удалось изменить пароль';
      setPasswordError(typeof msg === 'string' ? msg : 'Ошибка смены пароля');
    } finally {
      setPasswordSaving(false);
    }
  };

  const getUserTypeIcon = (type) => {
    switch(type) {
      case 'doctor': return <Stethoscope size={20} />;
      case 'nurse': return <Activity size={20} />;
      case 'admin': return <Shield size={20} />;
      default: return <User size={20} />;
    }
  };

  const getUserTypeLabel = (type) => {
    switch(type) {
      case 'doctor': return 'Врач';
      case 'nurse': return 'Медсестра';
      case 'admin': return 'Администратор';
      default: return 'Пациент';
    }
  };

  const getUserTypeColor = (type) => {
    switch(type) {
      case 'doctor': return '#0ea5e9';
      case 'nurse': return '#8b5cf6';
      case 'admin': return '#f59e0b';
      default: return '#10b981';
    }
  };

  // Функционал для врача
  const openPatientCard = (patient) => {
    setSelectedPatient(patient);
    setIsPatientModalOpen(true);
  };

  const closePatientCard = () => {
    setSelectedPatient(null);
    setIsPatientModalOpen(false);
    setNewPrescription({
      medicine: '',
      dosage: '',
      frequency: '',
      duration: '',
      notes: ''
    });
    setNewTest({
      type: '',
      result: '',
      date: new Date().toISOString().split('T')[0],
      lab: '',
      notes: ''
    });
  };

  const addPrescription = () => {
    if (!newPrescription.medicine || !newPrescription.dosage) return;

    const prescription = {
      id: Date.now(),
      ...newPrescription,
      date: new Date().toISOString().split('T')[0],
      doctor: `${currentUser.firstName} ${currentUser.lastName}`
    };

    setPatients(prevPatients =>
      prevPatients.map(patient =>
        patient.id === selectedPatient.id
          ? {
              ...patient,
              prescriptions: [...patient.prescriptions, prescription]
            }
          : patient
      )
    );

    setSelectedPatient(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, prescription]
    }));

    setNewPrescription({
      medicine: '',
      dosage: '',
      frequency: '',
      duration: '',
      notes: ''
    });
  };

  const addTestResult = () => {
    if (!newTest.type || !newTest.result) return;

    const test = {
      id: Date.now(),
      ...newTest,
      date: new Date().toISOString().split('T')[0]
    };

    setPatients(prevPatients =>
      prevPatients.map(patient =>
        patient.id === selectedPatient.id
          ? {
              ...patient,
              testResults: [...patient.testResults, test]
            }
          : patient
      )
    );

    setSelectedPatient(prev => ({
      ...prev,
      testResults: [...prev.testResults, test]
    }));

    setNewTest({
      type: '',
      result: '',
      date: new Date().toISOString().split('T')[0],
      lab: '',
      notes: ''
    });
  };

  const toggleAttendance = (date, currentStatus) => {
    const newStatus = currentStatus === 'attended' ? 'missed' : 'attended';
    
    setPatients(prevPatients =>
      prevPatients.map(patient =>
        patient.id === selectedPatient.id
          ? {
              ...patient,
              attendance: patient.attendance.map(a =>
                a.date === date ? { ...a, status: newStatus } : a
              )
            }
          : patient
      )
    );

    setSelectedPatient(prev => ({
      ...prev,
      attendance: prev.attendance.map(a =>
        a.date === date ? { ...a, status: newStatus } : a
      )
    }));
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  // Функционал для пациента
  const cancelAppointment = (id) => {
    setUpcomingAppointments(prev => 
      prev.filter(appointment => appointment.id !== id)
    );
  };

  const rescheduleAppointment = (id) => {
    const appointment = upcomingAppointments.find(a => a.id === id);
    if (appointment) {
      alert(`Перенос записи к ${appointment.doctor}`);
    }
  };

  const downloadMedicalRecord = (id) => {
    const record = patientRecords.find(r => r.id === id);
    if (record) {
      alert(`Скачивание записи от ${record.date}`);
    }
  };

  const requestPrescriptionRenewal = (id) => {
    const record = patientRecords.find(r => r.id === id);
    if (record) {
      alert(`Запрос на продление рецепта: ${record.prescription}`);
    }
  };

  // Функционал для медсестры
  const completeTask = (id) => {
    setNurseTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, status: 'completed', completedAt: new Date().toLocaleTimeString() } : task
      )
    );
  };

  const addTaskNote = (id, note) => {
    setNurseTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, note } : task
      )
    );
  };

  const updateInventory = (id, quantity) => {
    setInventory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const requestSupply = (item) => {
    alert(`Запрос на пополнение: ${item}`);
  };

  // Функционал для администратора
  const approveRequest = (id) => {
    setPendingRequests(prev =>
      prev.map(request =>
        request.id === id ? { ...request, status: 'approved', approvedAt: new Date().toLocaleString() } : request
      )
    );
  };

  const rejectRequest = (id) => {
    setPendingRequests(prev =>
      prev.map(request =>
        request.id === id ? { ...request, status: 'rejected' } : request
      )
    );
  };

  const generateReport = (type) => {
    alert(`Генерация отчета: ${type}`);
  };

  const backupSystem = () => {
    alert('Запуск резервного копирования системы...');
  };

  const clearCache = () => {
    alert('Очистка кэша системы...');
  };

  const PatientCardModal = () => {
    if (!selectedPatient) return null;

    return (
      <div className={`patient-modal-overlay ${isPatientModalOpen ? 'active' : ''}`}>
        <div className="patient-modal">
          <div className="patient-modal-header">
            <div>
              <h3 className="patient-modal-title">
                Карточка пациента: {selectedPatient.firstName} {selectedPatient.lastName}
              </h3>
              <div className="patient-modal-subtitle">
                <span>Возраст: {selectedPatient.age} лет</span>
                <span>Телефон: {selectedPatient.phone}</span>
                <span className={`patient-status patient-status-${selectedPatient.status}`}>
                  {selectedPatient.status === 'active' ? 'Активный' : 'Неактивный'}
                </span>
              </div>
            </div>
            <button className="patient-modal-close" onClick={closePatientCard}>
              <X size={20} />
            </button>
          </div>

          <div className="patient-modal-content">
            <div className="patient-modal-tabs">
              <button
                className={`patient-modal-tab ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Общая информация
              </button>
              <button
                className={`patient-modal-tab ${activeTab === 'prescriptions' ? 'active' : ''}`}
                onClick={() => setActiveTab('prescriptions')}
              >
                Назначения
              </button>
              <button
                className={`patient-modal-tab ${activeTab === 'tests' ? 'active' : ''}`}
                onClick={() => setActiveTab('tests')}
              >
                Анализы
              </button>
              <button
                className={`patient-modal-tab ${activeTab === 'attendance' ? 'active' : ''}`}
                onClick={() => setActiveTab('attendance')}
              >
                Посещения
              </button>
            </div>

            <div className="patient-modal-tab-content">
              {activeTab === 'profile' && (
                <div className="patient-profile-info">
                  <div className="patient-section">
                    <h4>Жалобы</h4>
                    <p>{selectedPatient.complaints || 'Жалоб нет'}</p>
                  </div>
                  
                  <div className="patient-section">
                    <h4>История болезни</h4>
                    {selectedPatient.medicalHistory.length > 0 ? (
                      selectedPatient.medicalHistory.map(record => (
                        <div key={record.id} className="medical-history-item">
                          <div className="medical-history-date">{record.date}</div>
                          <div className="medical-history-diagnosis">{record.diagnosis}</div>
                          <div className="medical-history-doctor">{record.doctor}</div>
                          {record.notes && (
                            <div className="medical-history-notes">{record.notes}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>История болезни пуста</p>
                    )}
                  </div>
                  
                  <div className="patient-section">
                    <h4>Предыдущие назначения других врачей</h4>
                    {selectedPatient.prescriptions.filter(p => p.doctor !== `${currentUser.firstName} ${currentUser.lastName}`).length > 0 ? (
                      selectedPatient.prescriptions
                        .filter(p => p.doctor !== `${currentUser.firstName} ${currentUser.lastName}`)
                        .map(prescription => (
                          <div key={prescription.id} className="other-prescription">
                            <div className="prescription-header">
                              <strong>{prescription.medicine}</strong>
                              <span>{prescription.doctor}</span>
                            </div>
                            <div className="prescription-details">
                              {prescription.dosage}, {prescription.frequency}, {prescription.duration}
                            </div>
                            {prescription.notes && (
                              <div className="prescription-notes">{prescription.notes}</div>
                            )}
                          </div>
                        ))
                    ) : (
                      <p>Нет назначений от других врачей</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'prescriptions' && (
                <div className="patient-prescriptions">
                  <div className="prescriptions-list">
                    <h4>Текущие назначения</h4>
                    {selectedPatient.prescriptions.length > 0 ? (
                      selectedPatient.prescriptions.map(prescription => (
                        <div key={prescription.id} className="prescription-item">
                          <div className="prescription-header">
                            <strong>{prescription.medicine}</strong>
                            <span>{prescription.date}</span>
                          </div>
                          <div className="prescription-details">
                            <span>{prescription.dosage}</span>
                            <span>{prescription.frequency}</span>
                            <span>{prescription.duration}</span>
                          </div>
                          {prescription.notes && (
                            <div className="prescription-notes">{prescription.notes}</div>
                          )}
                          <div className="prescription-doctor">{prescription.doctor}</div>
                        </div>
                      ))
                    ) : (
                      <p>Назначений нет</p>
                    )}
                  </div>

                  <div className="add-prescription">
                    <h4>Добавить назначение</h4>
                    <div className="prescription-form">
                      <input
                        type="text"
                        placeholder="Лекарство"
                        value={newPrescription.medicine}
                        onChange={(e) => setNewPrescription({...newPrescription, medicine: e.target.value})}
                        className="prescription-input"
                      />
                      <input
                        type="text"
                        placeholder="Дозировка"
                        value={newPrescription.dosage}
                        onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                        className="prescription-input"
                      />
                      <input
                        type="text"
                        placeholder="Частота приема"
                        value={newPrescription.frequency}
                        onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})}
                        className="prescription-input"
                      />
                      <input
                        type="text"
                        placeholder="Длительность"
                        value={newPrescription.duration}
                        onChange={(e) => setNewPrescription({...newPrescription, duration: e.target.value})}
                        className="prescription-input"
                      />
                      <textarea
                        placeholder="Примечания"
                        value={newPrescription.notes}
                        onChange={(e) => setNewPrescription({...newPrescription, notes: e.target.value})}
                        className="prescription-textarea"
                      />
                      <button onClick={addPrescription} className="add-button">
                        <Plus size={16} />
                        Добавить назначение
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tests' && (
                <div className="patient-tests">
                  <div className="tests-list">
                    <h4>Результаты анализов</h4>
                    {selectedPatient.testResults.length > 0 ? (
                      selectedPatient.testResults.map(test => (
                        <div key={test.id} className="test-item">
                          <div className="test-header">
                            <strong>{test.type}</strong>
                            <span>{test.date}</span>
                          </div>
                          <div className="test-details">
                            <span className="test-result">
                              Результат: <strong>{test.result}</strong>
                            </span>
                            {test.lab && <span>Лаборатория: {test.lab}</span>}
                          </div>
                          {test.notes && (
                            <div className="test-notes">{test.notes}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>Результатов анализов нет</p>
                    )}
                  </div>

                  <div className="add-test">
                    <h4>Добавить результат анализа</h4>
                    <div className="test-form">
                      <input
                        type="text"
                        placeholder="Тип анализа"
                        value={newTest.type}
                        onChange={(e) => setNewTest({...newTest, type: e.target.value})}
                        className="test-input"
                      />
                      <input
                        type="text"
                        placeholder="Результат"
                        value={newTest.result}
                        onChange={(e) => setNewTest({...newTest, result: e.target.value})}
                        className="test-input"
                      />
                      <input
                        type="date"
                        value={newTest.date}
                        onChange={(e) => setNewTest({...newTest, date: e.target.value})}
                        className="test-input"
                      />
                      <input
                        type="text"
                        placeholder="Лаборатория"
                        value={newTest.lab}
                        onChange={(e) => setNewTest({...newTest, lab: e.target.value})}
                        className="test-input"
                      />
                      <textarea
                        placeholder="Примечания"
                        value={newTest.notes}
                        onChange={(e) => setNewTest({...newTest, notes: e.target.value})}
                        className="test-textarea"
                      />
                      <button onClick={addTestResult} className="add-button">
                        <Plus size={16} />
                        Добавить результат
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'attendance' && (
                <div className="patient-attendance">
                  <div className="attendance-stats">
                    <div className="stat-card">
                      <div className="stat-value">
                        {selectedPatient.attendance.filter(a => a.status === 'attended').length}
                      </div>
                      <div className="stat-label">Посещений</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">
                        {selectedPatient.attendance.filter(a => a.status === 'missed').length}
                      </div>
                      <div className="stat-label">Пропусков</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">
                        {selectedPatient.attendance.filter(a => a.status === 'cancelled').length}
                      </div>
                      <div className="stat-label">Отмен</div>
                    </div>
                  </div>

                  <div className="attendance-list">
                    <h4>История посещений</h4>
                    {selectedPatient.attendance.length > 0 ? (
                      selectedPatient.attendance.map((record, index) => (
                        <div key={index} className="attendance-item">
                          <div className="attendance-date">{record.date}</div>
                          <div className={`attendance-status attendance-status-${record.status}`}>
                            {record.status === 'attended' && (
                              <>
                                <CheckCircle size={16} />
                                Посетил
                              </>
                            )}
                            {record.status === 'missed' && (
                              <>
                                <AlertCircle size={16} />
                                Не посетил
                              </>
                            )}
                            {record.status === 'cancelled' && (
                              <>
                                <X size={16} />
                                Отменен
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => toggleAttendance(record.date, record.status)}
                            className="toggle-attendance"
                          >
                            Изменить статус
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>История посещений пуста</p>
                    )}
                  </div>

                  <div className="add-attendance">
                    <h4>Добавить запись о посещении</h4>
                    <button
                      onClick={() => {
                        const today = new Date().toISOString().split('T')[0];
                        setPatients(prevPatients =>
                          prevPatients.map(patient =>
                            patient.id === selectedPatient.id
                              ? {
                                  ...patient,
                                  attendance: [...patient.attendance, { date: today, status: 'attended' }]
                                }
                              : patient
                          )
                        );
                        setSelectedPatient(prev => ({
                          ...prev,
                          attendance: [...prev.attendance, { date: today, status: 'attended' }]
                        }));
                      }}
                      className="add-button"
                    >
                      <Plus size={16} />
                      Добавить сегодняшнее посещение
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Рендер панели пациента
  const renderPatientPanel = () => (
    <div className="profile-content-section">
      <div className="profile-content-block">
        <div className="profile-section-header">
          <h3 className="profile-section-title">
            <Calendar size={18} />
            Мои записи
          </h3>
          <button className="profile-section-action" onClick={() => navigate('/doctors')}>
            <Plus size={16} />
            Новая запись
          </button>
        </div>
        
        <div className="appointments-list">
          {upcomingAppointments.map(appointment => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-header">
                <div className="appointment-date-badge">
                  <div className="appointment-day">{new Date(appointment.date).getDate()}</div>
                  <div className="appointment-month">
                    {new Date(appointment.date).toLocaleString('ru-RU', { month: 'short' })}
                  </div>
                </div>
                <div className="appointment-info">
                  <div className="appointment-time-doctor">
                    <span className="appointment-time">{appointment.time}</span>
                    <span className="appointment-doctor">{appointment.doctor}</span>
                  </div>
                  <div className="appointment-details">
                    <span className="appointment-specialty">{appointment.specialty}</span>
                    <span className="appointment-room">{appointment.room}</span>
                  </div>
                  <div className={`appointment-status appointment-status-${appointment.status}`}>
                    {appointment.status === 'confirmed' ? 'Подтверждено' : 'Ожидает подтверждения'}
                  </div>
                </div>
              </div>
              <div className="appointment-actions">
                <button 
                  className="appointment-action-btn secondary"
                  onClick={() => rescheduleAppointment(appointment.id)}
                >
                  <Calendar size={14} />
                  Перенести
                </button>
                <button 
                  className="appointment-action-btn danger"
                  onClick={() => cancelAppointment(appointment.id)}
                >
                  <X size={14} />
                  Отменить
                </button>
                <button className="appointment-action-btn">
                  <MessageSquare size={14} />
                  Написать врачу
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-content-block">
        <div className="profile-section-header">
          <h3 className="profile-section-title">
            <Heart size={18} />
            Медицинская история
          </h3>
          <button className="profile-section-action" onClick={() => alert('Полная история')}>
            <History size={16} />
            Вся история
          </button>
        </div>
        
        <div className="medical-records">
          {patientRecords.map(record => (
            <div key={record.id} className="medical-record-card">
              <div className="record-header">
                <div className="record-date">{new Date(record.date).toLocaleDateString('ru-RU')}</div>
                <div className={`record-status record-status-${record.status}`}>
                  {record.status === 'active' ? 'Активно' : 'Завершено'}
                </div>
              </div>
              <div className="record-info">
                <div className="record-doctor">{record.doctor} ({record.specialty})</div>
                <div className="record-diagnosis">{record.diagnosis}</div>
                <div className="record-prescription">{record.prescription}</div>
              </div>
              <div className="record-actions">
                <button 
                  className="record-action-btn"
                  onClick={() => downloadMedicalRecord(record.id)}
                >
                  <Download size={14} />
                  Скачать
                </button>
                <button 
                  className="record-action-btn"
                  onClick={() => requestPrescriptionRenewal(record.id)}
                >
                  <FileEdit size={14} />
                  Продлить рецепт
                </button>
                <button className="record-action-btn">
                  <Printer size={14} />
                  Распечатать
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-content-block">
        <h3 className="profile-section-title">
          <CreditCard size={18} />
          Финансы и оплата
        </h3>
        <div className="finance-section">
          <div className="finance-cards">
            <div className="finance-card">
              <div className="finance-card-title">Баланс</div>
              <div className="finance-card-amount">5 430 ₽</div>
              <div className="finance-card-subtitle">На счету</div>
              <button className="finance-card-btn">Пополнить</button>
            </div>
            <div className="finance-card">
              <div className="finance-card-title">Последний платеж</div>
              <div className="finance-card-amount">1 200 ₽</div>
              <div className="finance-card-subtitle">15.02.2024</div>
              <button className="finance-card-btn secondary">Квитанция</button>
            </div>
          </div>
          <div className="payment-history">
            <h4>История платежей</h4>
            <div className="payment-list">
              {['Консультация кардиолога', 'Анализы крови', 'УЗИ сердца'].map((item, idx) => (
                <div key={idx} className="payment-item">
                  <span>{item}</span>
                  <span>1 200 ₽</span>
                  <span className="payment-status paid">Оплачено</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content-block">
        <h3 className="profile-section-title">
          <Bell size={18} />
          Уведомления
        </h3>
        <div className="notifications-panel">
          <div className="notification-item unread">
            <AlertCircle size={16} />
            <div>
              <div className="notification-title">Напоминание о приеме</div>
              <div className="notification-text">Через 2 дня у вас прием у кардиолога</div>
              <div className="notification-time">Сегодня 10:30</div>
            </div>
          </div>
          <div className="notification-item">
            <CheckCircle size={16} />
            <div>
              <div className="notification-title">Результаты анализов готовы</div>
              <div className="notification-time">Вчера 14:20</div>
            </div>
          </div>
          <button className="view-all-notifications">
            Показать все уведомления
          </button>
        </div>
      </div>
    </div>
  );

  // Рендер панели медсестры
  const renderNursePanel = () => (
    <div className="profile-content-section">
      <div className="profile-content-block">
        <div className="profile-section-header">
          <h3 className="profile-section-title">
            <Activity size={18} />
            Задачи на сегодня
          </h3>
          <button className="profile-section-action">
            <Plus size={16} />
            Новая задача
          </button>
        </div>
        
        <div className="tasks-panel">
          <div className="tasks-filters">
            <button className="filter-btn active">Все ({nurseTasks.length})</button>
            <button className="filter-btn">Высокий приоритет</button>
            <button className="filter-btn">Завершенные</button>
          </div>
          
          <div className="tasks-list">
            {nurseTasks.map(task => (
              <div key={task.id} className={`task-card task-priority-${task.priority}`}>
                <div className="task-header">
                  <div className="task-patient">
                    <User size={14} />
                    {task.patient}
                  </div>
                  <div className="task-time">{task.time}</div>
                </div>
                <div className="task-content">
                  <div className="task-procedure">{task.procedure}</div>
                  <div className="task-room">{task.room}</div>
                  {task.note && (
                    <div className="task-note">{task.note}</div>
                  )}
                </div>
                <div className="task-actions">
                  {task.status === 'pending' ? (
                    <>
                      <button 
                        className="task-action-btn success"
                        onClick={() => completeTask(task.id)}
                      >
                        <CheckCircle size={14} />
                        Выполнено
                      </button>
                      <button 
                        className="task-action-btn"
                        onClick={() => addTaskNote(task.id, prompt('Добавить примечание:'))}
                      >
                        <Edit3 size={14} />
                        Заметка
                      </button>
                    </>
                  ) : (
                    <div className="task-completed">
                      <CheckCircle size={14} />
                      Выполнено в {task.completedAt}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-content-block">
        <div className="profile-section-header">
          <h3 className="profile-section-title">
            <ClipboardList size={18} />
            Инвентарь и расходники
          </h3>
          <button className="profile-section-action">
            <Plus size={16} />
            Добавить позицию
          </button>
        </div>
        
        <div className="inventory-panel">
          <div className="inventory-summary">
            <div className="inventory-stat">
              <div className="stat-value">{inventory.length}</div>
              <div className="stat-label">Позиций</div>
            </div>
            <div className="inventory-stat warning">
              <div className="stat-value">
                {inventory.filter(item => item.quantity <= item.threshold).length}
              </div>
              <div className="stat-label">Требуют пополнения</div>
            </div>
          </div>
          
          <div className="inventory-list">
            {inventory.map(item => (
              <div key={item.id} className={`inventory-item ${item.quantity <= item.threshold ? 'low-stock' : ''}`}>
                <div className="inventory-info">
                  <div className="inventory-name">{item.item}</div>
                  <div className="inventory-quantity">
                    Количество: <span>{item.quantity}</span>
                  </div>
                  <div className="inventory-threshold">
                    Минимальный запас: {item.threshold}
                  </div>
                </div>
                <div className="inventory-actions">
                  <button 
                    className="inventory-action-btn"
                    onClick={() => updateInventory(item.id, item.quantity + 10)}
                  >
                    <Plus size={14} />
                    Добавить
                  </button>
                  {item.quantity <= item.threshold && (
                    <button 
                      className="inventory-action-btn warning"
                      onClick={() => requestSupply(item.item)}
                    >
                      <AlertCircle size={14} />
                      Заказать
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-content-block">
        <h3 className="profile-section-title">
          <TrendingUp size={18} />
          Статистика за смену
        </h3>
        <div className="nurse-stats">
          <div className="nurse-stat-card">
            <div className="stat-icon">
              <Activity size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">14</div>
              <div className="stat-label">Процедур выполнено</div>
            </div>
          </div>
          <div className="nurse-stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">8</div>
              <div className="stat-label">Пациентов обслужено</div>
            </div>
          </div>
          <div className="nurse-stat-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">4ч 30м</div>
              <div className="stat-label">Рабочего времени</div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content-block">
        <h3 className="profile-section-title">
          <FileText size={18} />
          Отчетность и документы
        </h3>
        <div className="documents-panel">
          <div className="document-actions">
            <button className="document-action-btn">
              <Printer size={16} />
              Сменный отчет
            </button>
            <button className="document-action-btn">
              <Download size={16} />
              Скачать журнал
            </button>
            <button className="document-action-btn">
              <Upload size={16} />
              Загрузить данные
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Рендер панели администратора
  const renderAdminPanel = () => (
    <div className="profile-content-section">
      <div className="profile-content-block">
        <h3 className="profile-section-title">
          <BarChart size={18} />
          Статистика системы
        </h3>
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <Users size={20} />
              <span>Пользователи</span>
            </div>
            <div className="admin-stat-value">{systemStats.totalUsers}</div>
            <div className="admin-stat-trend positive">+12 за месяц</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <Calendar size={20} />
              <span>Записи сегодня</span>
            </div>
            <div className="admin-stat-value">{systemStats.appointmentsToday}</div>
            <div className="admin-stat-trend">Запланировано</div>
          </div>
          <div className="admin-stat-card revenue">
            <div className="admin-stat-header">
              <CreditCard size={20} />
              <span>Выручка сегодня</span>
            </div>
            <div className="admin-stat-value">{systemStats.revenueToday.toLocaleString()} ₽</div>
            <div className="admin-stat-trend positive">+15% к прошлой неделе</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <Server size={20} />
              <span>Нагрузка системы</span>
            </div>
            <div className="admin-stat-value">{systemStats.systemLoad}%</div>
            <div className="admin-stat-trend neutral">Нормальная</div>
          </div>
        </div>
      </div>

      <div className="profile-content-block">
        <div className="profile-section-header">
          <h3 className="profile-section-title">
            <Shield size={18} />
            Запросы на утверждение
          </h3>
          <button className="profile-section-action" onClick={() => alert('Все запросы')}>
            Показать все
          </button>
        </div>
        
        <div className="requests-panel">
          {pendingRequests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div className="request-type">
                  {request.type === 'registration' && 'Регистрация'}
                  {request.type === 'access' && 'Доступ'}
                  {request.type === 'equipment' && 'Закупка'}
                </div>
                <div className="request-date">{request.date}</div>
              </div>
              <div className="request-info">
                <div className="request-user">{request.user}</div>
                {request.email && <div className="request-email">{request.email}</div>}
                {request.request && <div className="request-text">{request.request}</div>}
                {request.amount && (
                  <div className="request-amount">{request.amount.toLocaleString()} ₽</div>
                )}
              </div>
              {request.status === 'pending' && (
                <div className="request-actions">
                  <button 
                    className="request-action-btn approve"
                    onClick={() => approveRequest(request.id)}
                  >
                    <CheckCircle size={14} />
                    Утвердить
                  </button>
                  <button 
                    className="request-action-btn reject"
                    onClick={() => rejectRequest(request.id)}
                  >
                    <X size={14} />
                    Отклонить
                  </button>
                  <button className="request-action-btn">
                    <MessageSquare size={14} />
                    Обсудить
                  </button>
                </div>
              )}
              {request.status === 'approved' && (
                <div className="request-status approved">
                  <CheckCircle size={14} />
                  Утверждено {request.approvedAt}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="profile-content-block">
        <div className="profile-section-header">
          <h3 className="profile-section-title">
            <Settings size={18} />
            Управление системой
          </h3>
          <div className="admin-actions">
            <button className="admin-action-btn" onClick={backupSystem}>
              <Database size={16} />
              Резервная копия
            </button>
            <button className="admin-action-btn" onClick={clearCache}>
              <Zap size={16} />
              Очистка кэша
            </button>
          </div>
        </div>
        
        <div className="system-controls">
          <div className="control-group">
            <h4>Безопасность</h4>
            <div className="control-actions">
              <button className="control-btn">
                <ShieldCheck size={14} />
                Проверить безопасность
              </button>
              <button className="control-btn">
                <Key size={14} />
                Сбросить пароли
              </button>
              <button className="control-btn">
                <BellOff size={14} />
                Настройки уведомлений
              </button>
            </div>
          </div>
          
          <div className="control-group">
            <h4>Отчетность</h4>
            <div className="control-actions">
              <button className="control-btn" onClick={() => generateReport('financial')}>
                <CreditCard size={14} />
                Финансовый отчет
              </button>
              <button className="control-btn" onClick={() => generateReport('medical')}>
                <FileText size={14} />
                Медицинский отчет
              </button>
              <button className="control-btn" onClick={() => generateReport('users')}>
                <Users size={14} />
                Отчет по пользователям
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content-block">
        <h3 className="profile-section-title">
          <Network size={18} />
          Активность системы
        </h3>
        <div className="activity-log">
          {recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-action">{activity.action}</div>
              <div className="activity-meta">
                <span className="activity-user">{activity.user}</span>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
          <button className="view-all-activity">
            Показать всю активность
          </button>
        </div>
      </div>
    </div>
  );

  // Рендер панели врача
  const renderDoctorPanel = () => {
    return (
      <>
        <div className="profile-content-block">
          <h3 className="profile-section-title">
            <Stethoscope size={18} />
            Мои пациенты
          </h3>
          
          <div className="doctor-patients-panel">
            <div className="patients-search">
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Поиск пациентов по имени или телефону..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="patients-search-input"
                />
                <Filter size={18} className="filter-icon" />
              </div>
              
              <div className="patients-summary">
                <div className="summary-card">
                  <div className="summary-value">{filteredPatients.length}</div>
                  <div className="summary-label">Всего пациентов</div>
                </div>
                <div className="summary-card">
                  <div className="summary-value">
                    {filteredPatients.filter(p => p.status === 'active').length}
                  </div>
                  <div className="summary-label">Активных</div>
                </div>
                <div className="summary-card">
                  <div className="summary-value">
                    {filteredPatients.filter(p => p.nextAppointment).length}
                  </div>
                  <div className="summary-label">С записями</div>
                </div>
              </div>
            </div>

            <div className="patients-list">
              {filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                  <div key={patient.id} className="patient-card">
                    <div className="patient-card-header">
                      <div className="patient-avatar">
                        <User size={20} />
                      </div>
                      <div className="patient-info">
                        <div className="patient-name">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="patient-details">
                          <span>{patient.age} лет</span>
                          <span>{patient.phone}</span>
                          <span className={`patient-status patient-status-${patient.status}`}>
                            {patient.status === 'active' ? 'Активный' : 'Неактивный'}
                          </span>
                        </div>
                      </div>
                      <button
                        className="open-patient-card-btn"
                        onClick={() => openPatientCard(patient)}
                      >
                        <Eye size={16} />
                        Открыть карточку
                      </button>
                    </div>
                    
                    <div className="patient-card-content">
                      <div className="patient-last-visit">
                        <Clock size={14} />
                        Последний визит: {patient.lastVisit || 'Нет данных'}
                      </div>
                      <div className="patient-next-appointment">
                        <Calendar size={14} />
                        Следующая запись: {patient.nextAppointment || 'Нет записи'}
                      </div>
                      <div className="patient-complaints">
                        Жалобы: {patient.complaints || 'Нет жалоб'}
                      </div>
                    </div>
                    
                    <div className="patient-card-footer">
                      <div className="patient-stats">
                        <div className="patient-stat">
                          <ClipboardList size={14} />
                          Назначений: {patient.prescriptions.length}
                        </div>
                        <div className="patient-stat">
                          <FileText size={14} />
                          Анализов: {patient.testResults.length}
                        </div>
                        <div className="patient-stat">
                          <Heart size={14} />
                          Посещений: {patient.attendance.filter(a => a.status === 'attended').length}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-patients">
                  <User size={48} />
                  <p>Пациенты не найдены</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-content-block">
          <h3 className="profile-section-title">
            <Calendar size={18} />
            Расписание на сегодня
          </h3>
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-value">{filteredPatients.length || 0}</div>
              <div className="profile-stat-label">Всего пациентов</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">
                {filteredPatients.filter(p => p.nextAppointment).length}
              </div>
              <div className="profile-stat-label">С записями</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">
                {currentUser.experience || 0} лет
              </div>
              <div className="profile-stat-label">Опыт работы</div>
            </div>
          </div>
          
          <div className="profile-appointments">
            <h4>Ближайшие приемы:</h4>
            {filteredPatients
              .filter(p => p.nextAppointment)
              .slice(0, 3)
              .map(patient => (
                <div key={patient.id} className="profile-appointment">
                  <div className="appointment-date">
                    <div className="appointment-day">
                      {new Date(patient.nextAppointment).getDate()}
                    </div>
                    <div className="appointment-month">
                      {new Date(patient.nextAppointment).toLocaleString('ru-RU', { month: 'short' })}
                    </div>
                  </div>
                  <div className="appointment-info">
                    <div className="appointment-time-doctor">
                      <span className="appointment-patient">{patient.firstName} {patient.lastName}</span>
                    </div>
                    <div className="appointment-specialty">{patient.complaints}</div>
                    <button
                      className="appointment-action-btn"
                      onClick={() => openPatientCard(patient)}
                    >
                      Открыть карточку
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="profile-content-block">
          <h3 className="profile-section-title">
            <FileText size={18} />
            Быстрые действия
          </h3>
          <div className="quick-actions">
            <button
              className="quick-action-btn"
              onClick={() => {
                if (filteredPatients.length > 0) {
                  openPatientCard(filteredPatients[0]);
                }
              }}
            >
              <ClipboardList size={20} />
              Добавить назначение
            </button>
            <button
              className="quick-action-btn"
              onClick={() => {
                if (filteredPatients.length > 0) {
                  openPatientCard(filteredPatients[0]);
                  setActiveTab('tests');
                }
              }}
            >
              <FileText size={20} />
              Добавить анализы
            </button>
            <button
              className="quick-action-btn"
              onClick={() => {
                if (filteredPatients.length > 0) {
                  openPatientCard(filteredPatients[0]);
                  setActiveTab('attendance');
                }
              }}
            >
              <CheckCircle size={20} />
              Отметить посещение
            </button>
          </div>
        </div>
      </>
    );
  };

  // Выбор панели в зависимости от типа пользователя
  const renderUserPanel = () => {
    switch(currentUser.type) {
      case 'patient':
        return renderPatientPanel();
      case 'nurse':
        return renderNursePanel();
      case 'admin':
        return renderAdminPanel();
      case 'doctor':
        return renderDoctorPanel();
      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-bg-shapes">
        <div className="profile-circle profile-circle1"></div>
        <div className="profile-circle profile-circle2"></div>
        <div className="profile-circle profile-circle3"></div>
        <div className="profile-circle profile-circle4"></div>
      </div>

      <section className="profile-section">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-tag">
              <div className="profile-tag-dot"></div>
              ЛИЧНЫЙ КАБИНЕТ
            </div>
            <h1 className="profile-title">
              Добро пожаловать,
              <span className="profile-title-highlight">{currentUser.firstName}!</span>
            </h1>
            <p className="profile-description">
              {currentUser.type === 'patient' 
                ? 'Управляйте вашими записями, историей болезни и персональными данными'
                : currentUser.type === 'doctor'
                ? 'Ваше рабочее пространство для ведения пациентов и расписания'
                : currentUser.type === 'nurse'
                ? 'Рабочая панель для выполнения процедур и работы с пациентами'
                : 'Панель управления медицинским центром и системами безопасности'
              }
            </p>
          </div>

          <div className="profile-card">
            <div className="profile-content">
              <div className="profile-grid">
                <div className="profile-info-section">
                  <div className="profile-info-header">
                    <div className="profile-avatar" style={{background: getUserTypeColor(currentUser.type)}}>
                      {getUserTypeIcon(currentUser.type)}
                    </div>
                    <div className="profile-name-role">
                      <h2>{currentUser.firstName} {currentUser.lastName}</h2>
                      <div className="profile-role">
                        <span className="profile-role-badge" style={{background: getUserTypeColor(currentUser.type)}}>
                          {getUserTypeLabel(currentUser.type)}
                        </span>
                        {currentUser.specialty && (
                          <span className="profile-specialty">{currentUser.specialty}</span>
                        )}
                        {currentUser.department && (
                          <span className="profile-department">{currentUser.department}</span>
                        )}
                      </div>
                    </div>
                    <div className="profile-actions">
                      {profileSaveError && (
                        <div className="profile-save-error">{profileSaveError}</div>
                      )}
                      {isEditing ? (
                        <div className="profile-edit-actions">
                          <button
                            type="button"
                            className="profile-action-button profile-action-save"
                            onClick={handleSave}
                            disabled={profileSaving}
                          >
                            <Save size={16} />
                            {profileSaving ? 'Сохранение...' : 'Сохранить'}
                          </button>
                          <button className="profile-action-button profile-action-cancel" onClick={handleCancel}>
                            <X size={16} />
                            Отмена
                          </button>
                        </div>
                      ) : (
                        <button className="profile-action-button profile-action-edit" onClick={() => setIsEditing(true)}>
                          <Edit2 size={16} />
                          Редактировать
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="profile-info-content">
                    <h3 className="profile-section-title">
                      <User size={18} />
                      Персональные данные
                    </h3>
                    
                    <div className="profile-form">
                      <div className="profile-input-group">
                        <label className="profile-label">Имя</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={userData.firstName || ''}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="profile-input"
                          />
                        ) : (
                          <div className="profile-info-value">{currentUser.firstName}</div>
                        )}
                      </div>

                      <div className="profile-input-group">
                        <label className="profile-label">Фамилия</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={userData.lastName || ''}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="profile-input"
                          />
                        ) : (
                          <div className="profile-info-value">{currentUser.lastName}</div>
                        )}
                      </div>

                      <div className="profile-input-group">
                        <label className="profile-label">Email</label>
                        {isEditing ? (
                          <div className="profile-input-wrapper">
                            <Mail size={18} className="profile-input-icon" />
                            <input
                              type="email"
                              value={userData.email || ''}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="profile-input"
                            />
                          </div>
                        ) : (
                          <div className="profile-info-value">
                            <Mail size={16} className="profile-info-icon" />
                            {currentUser.email}
                          </div>
                        )}
                      </div>

                      <div className="profile-input-group">
                        <label className="profile-label">Телефон</label>
                        {isEditing ? (
                          <div className="profile-input-wrapper">
                            <Phone size={18} className="profile-input-icon" />
                            <input
                              type="tel"
                              value={userData.phone || ''}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="profile-input"
                            />
                          </div>
                        ) : (
                          <div className="profile-info-value">
                            <Phone size={16} className="profile-info-icon" />
                            {currentUser.phone}
                          </div>
                        )}
                      </div>

                      {currentUser.type === 'patient' && currentUser.insuranceNumber && (
                        <div className="profile-input-group">
                          <label className="profile-label">Номер полиса</label>
                          <div className="profile-info-value">
                            <FileText size={16} className="profile-info-icon" />
                            {currentUser.insuranceNumber}
                          </div>
                        </div>
                      )}

                      {currentUser.type === 'doctor' && currentUser.license && (
                        <div className="profile-input-group">
                          <label className="profile-label">Лицензия</label>
                          <div className="profile-info-value">
                            <Shield size={16} className="profile-info-icon" />
                            {currentUser.license}
                          </div>
                        </div>
                      )}

                      {currentUser.type === 'nurse' && currentUser.certification && (
                        <div className="profile-input-group">
                          <label className="profile-label">Сертификат</label>
                          <div className="profile-info-value">
                            <Award size={16} className="profile-info-icon" />
                            {currentUser.certification}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="profile-security">
                    <h3 className="profile-section-title">
                      <Lock size={18} />
                      Безопасность
                    </h3>
                    <div className="profile-security-actions">
                      <button type="button" className="profile-security-button" onClick={openPasswordModal}>
                        <Key size={16} />
                        Сменить пароль
                      </button>
                      <button className="profile-security-button">
                        <Bell size={16} />
                        Настройки уведомлений
                      </button>
                      {currentUser.type === 'admin' && (
                        <button className="profile-security-button">
                          <Shield size={16} />
                          Настройки безопасности
                        </button>
                      )}
                      <button className="profile-security-button profile-security-logout" onClick={handleLogout}>
                        <LogOut size={16} />
                        Выйти
                      </button>
                    </div>
                  </div>
                </div>

                <div className="profile-content-section">
                  {renderUserPanel()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Модальное окно смены пароля */}
      <div className={`password-modal-overlay ${isPasswordModalOpen ? 'active' : ''}`} onClick={closePasswordModal} aria-hidden={!isPasswordModalOpen}>
        <div className="password-modal" onClick={(e) => e.stopPropagation()}>
          <div className="password-modal-header">
            <div className="password-modal-title-wrap">
              <Lock size={22} className="password-modal-icon" />
              <h3 className="password-modal-title">Смена пароля</h3>
            </div>
            <p className="password-modal-subtitle">Введите новый пароль (не менее 6 символов)</p>
            <button type="button" className="password-modal-close" onClick={closePasswordModal} aria-label="Закрыть">
              <X size={20} />
            </button>
          </div>
          <form className="password-modal-form" onSubmit={handleChangePassword}>
            {passwordError && <div className="password-modal-error">{passwordError}</div>}
            {passwordSuccess && <div className="password-modal-success">{passwordSuccess}</div>}
            <div className="password-modal-field">
              <label className="password-modal-label">Новый пароль</label>
              <div className="password-modal-input-wrap">
                <Lock size={18} className="password-modal-input-icon" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="password-modal-input"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={6}
                  disabled={passwordSaving}
                />
                <button type="button" className="password-modal-toggle" onClick={() => setShowNewPassword((v) => !v)} aria-label={showNewPassword ? 'Скрыть пароль' : 'Показать пароль'}>
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="password-modal-field">
              <label className="password-modal-label">Подтвердите пароль</label>
              <div className="password-modal-input-wrap">
                <Lock size={18} className="password-modal-input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="password-modal-input"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={6}
                  disabled={passwordSaving}
                />
                <button type="button" className="password-modal-toggle" onClick={() => setShowConfirmPassword((v) => !v)} aria-label={showConfirmPassword ? 'Скрыть пароль' : 'Показать пароль'}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="password-modal-actions">
              <button type="button" className="password-modal-btn password-modal-btn-cancel" onClick={closePasswordModal} disabled={passwordSaving}>
                Отмена
              </button>
              <button type="submit" className="password-modal-btn password-modal-btn-submit" disabled={passwordSaving}>
                {passwordSaving ? 'Сохранение...' : 'Сохранить пароль'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <PatientCardModal />
    </div>
  );
};

export default ProfilePage;