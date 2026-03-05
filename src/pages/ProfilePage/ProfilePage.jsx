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
import { useInfoModal } from '../../context/InfoModalContext';
import { AuthAPI } from '../../api/auth';
import { AdminAPI } from '../../api/admin';
import {
  downloadCsv,
  buildUsersReportCsv,
  buildMedicalReportCsv,
  buildFinancialReportCsv,
} from '../../utils/csvReport';
import './ProfilePage.css';

function InventoryAddModal({ onClose, onSuccess, openInfo }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', quantity: 0, threshold: 0 });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await AuthAPI.createInventoryItem({
        name: form.name.trim(),
        quantity: form.quantity >= 0 ? form.quantity : 0,
        threshold: form.threshold >= 0 ? form.threshold : 0,
      });
      openInfo({ title: 'Готово', message: 'Позиция добавлена.', variant: 'success' });
      onSuccess();
    } catch (err) {
      openInfo({ title: 'Ошибка', message: err?.response?.data?.message || 'Не удалось добавить позицию.', variant: 'error' });
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="patient-modal-overlay active">
      <div className="patient-modal" style={{ maxWidth: 440 }}>
        <div className="patient-modal-header">
          <h3 className="patient-modal-title">Добавить позицию</h3>
          <button type="button" className="patient-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="patient-modal-content">
          <input
            className="prescription-input"
            placeholder="Название (например: Шприцы 5мл)"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <input
            type="number"
            min={0}
            className="prescription-input"
            placeholder="Начальное количество"
            value={form.quantity === 0 ? '' : form.quantity}
            onChange={(e) => setForm((f) => ({ ...f, quantity: parseInt(e.target.value, 10) || 0 }))}
          />
          <input
            type="number"
            min={0}
            className="prescription-input"
            placeholder="Минимальный запас"
            value={form.threshold === 0 ? '' : form.threshold}
            onChange={(e) => setForm((f) => ({ ...f, threshold: parseInt(e.target.value, 10) || 0 }))}
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="submit" className="add-button" disabled={saving}>
              {saving ? 'Добавление…' : 'Добавить'}
            </button>
            <button type="button" className="finance-card-btn secondary" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NurseNewTaskModal({ onClose, onSuccess, openInfo }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    patientName: '',
    description: '',
    room: '',
    scheduledTime: '08:00',
    taskDate: new Date().toISOString().split('T')[0],
    priority: 'normal',
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await AuthAPI.createMyTask({
        patientName: form.patientName,
        description: form.description,
        room: form.room || undefined,
        scheduledTime: form.scheduledTime,
        taskDate: form.taskDate,
        priority: form.priority,
      });
      openInfo({ title: 'Готово', message: 'Задача создана.', variant: 'success' });
      onSuccess();
    } catch (err) {
      openInfo({ title: 'Ошибка', message: err?.response?.data?.message || 'Не удалось создать задачу.', variant: 'error' });
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="patient-modal-overlay active">
      <div className="patient-modal" style={{ maxWidth: 520 }}>
        <div className="patient-modal-header">
          <h3 className="patient-modal-title">Новая задача</h3>
          <button type="button" className="patient-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="patient-modal-content">
          <input
            className="prescription-input"
            placeholder="ФИО пациента"
            value={form.patientName}
            onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
            required
          />
          <input
            className="prescription-input"
            placeholder="Описание процедуры"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            required
          />
          <input
            className="prescription-input"
            placeholder="Палата / кабинет"
            value={form.room}
            onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))}
          />
          <input
            type="time"
            className="prescription-input"
            value={form.scheduledTime}
            onChange={(e) => setForm((f) => ({ ...f, scheduledTime: e.target.value }))}
            required
          />
          <input
            type="date"
            className="prescription-input"
            value={form.taskDate}
            onChange={(e) => setForm((f) => ({ ...f, taskDate: e.target.value }))}
            required
          />
          <select
            className="prescription-input"
            value={form.priority}
            onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
          >
            <option value="normal">Обычный приоритет</option>
            <option value="high">Высокий приоритет</option>
          </select>
          <div class="prescription-btn" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="submit" className="add-button" disabled={saving}>
              {saving ? 'Создание…' : 'Создать задачу'}
            </button>
            <button type="button" className="finance-card-btn secondary" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updateUser, refreshUser } = useAuth();
  const { openInfo } = useInfoModal();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(() => ({ ...currentUser }));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [cardDataLoading, setCardDataLoading] = useState(false);
  const [cardPrescriptionSaving, setCardPrescriptionSaving] = useState(false);
  const [cardAnalysisSaving, setCardAnalysisSaving] = useState(false);
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
  const [isResetPasswordsModalOpen, setIsResetPasswordsModalOpen] = useState(false);
  const [resetPasswordsNew, setResetPasswordsNew] = useState('');
  const [resetPasswordsConfirm, setResetPasswordsConfirm] = useState('');
  const [resetPasswordsError, setResetPasswordsError] = useState('');
  const [resetPasswordsSuccess, setResetPasswordsSuccess] = useState('');
  const [resetPasswordsSaving, setResetPasswordsSaving] = useState(false);
  const [showResetNew, setShowResetNew] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [adminActionLoading, setAdminActionLoading] = useState(null);

  // Пациенты врача (с API, с пагинацией)
  const [doctorPatientsList, setDoctorPatientsList] = useState([]);
  const [doctorPatientsTotal, setDoctorPatientsTotal] = useState(0);
  const [doctorPatientsPage, setDoctorPatientsPage] = useState(1);
  const [doctorPatientsLoading, setDoctorPatientsLoading] = useState(false);
  const doctorPatientsPageSize = 10;

  // Визиты на сегодня (для блока «Ближайшие приемы»)
  const [todayVisitsList, setTodayVisitsList] = useState([]);
  const [todayVisitsTotal, setTodayVisitsTotal] = useState(0);
  const [todayVisitsPage, setTodayVisitsPage] = useState(1);
  const [todayVisitsLoading, setTodayVisitsLoading] = useState(false);
  const todayVisitsPageSize = 5;

  // Запросы на продление рецептов (для врача)
  const [doctorRenewalRequests, setDoctorRenewalRequests] = useState([]);
  const [doctorRenewalRequestsLoading, setDoctorRenewalRequestsLoading] = useState(false);
  const [renewalRequestUpdatingId, setRenewalRequestUpdatingId] = useState(null);

  // Модалки быстрых действий: выбор пациента / визита и формы
  const [quickActionType, setQuickActionType] = useState(null); // 'prescription' | 'analysis' | 'cancel'
  const [modalPatientSearch, setModalPatientSearch] = useState('');
  const [modalPatientPage, setModalPatientPage] = useState(1);
  const [modalPatientList, setModalPatientList] = useState([]);
  const [modalPatientTotal, setModalPatientTotal] = useState(0);
  const [modalPatientLoading, setModalPatientLoading] = useState(false);
  const modalPatientPageSize = 8;
  const [selectedPatientForAction, setSelectedPatientForAction] = useState(null); // { id, fullName, phone }
  const [prescriptionForm, setPrescriptionForm] = useState({
    prescriptionName: '',
    prescriptionDosage: '',
    prescriptionFrequency: '',
    prescriptionTime: '',
    description: '',
  });
  const [analysisForm, setAnalysisForm] = useState({
    type: '',
    text: '',
    assignedDate: new Date().toISOString().split('T')[0],
    costs: '',
  });
  const [quickActionSubmitting, setQuickActionSubmitting] = useState(false);
  // Для модалки «Отменить посещение» — пагинация визитов внутри модалки
  const [cancelVisitsPage, setCancelVisitsPage] = useState(1);
  const [cancelVisitsList, setCancelVisitsList] = useState([]);
  const [cancelVisitsTotal, setCancelVisitsTotal] = useState(0);
  const [cancelVisitsLoading, setCancelVisitsLoading] = useState(false);
  const cancelVisitsPageSize = 8;

  // Mock-данные для пациентов врача (если не врач — не используются)
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
    { id: 1, date: '2024-02-20', time: '10:00', doctor: 'Доктор Иванов', specialty: 'Кардиолог', room: 'Кабинет 205', status: 'confirmed' },
    { id: 2, date: '2024-02-25', time: '14:30', doctor: 'Доктор Петрова', specialty: 'Невролог', room: 'Кабинет 312', status: 'pending' }
  ]);

  // Данные пациента с API: записи, назначения, баланс
  const [patientAppointments, setPatientAppointments] = useState({ list: [], total: 0, page: 1, pageSize: 10 });
  const [patientAppointmentsLoading, setPatientAppointmentsLoading] = useState(false);
  const [patientPrescriptions, setPatientPrescriptions] = useState({ list: [], total: 0, page: 1, pageSize: 10 });
  const [patientPrescriptionsLoading, setPatientPrescriptionsLoading] = useState(false);
  const [patientBalance, setPatientBalance] = useState(0);
  const [patientBalanceLoading, setPatientBalanceLoading] = useState(false);
  const [prescriptionRenewalRequests, setPrescriptionRenewalRequests] = useState([]);
  const [renewRequestSending, setRenewRequestSending] = useState(null);

  // Данные для медсестры: задачи на сегодня
  const [nurseTasks, setNurseTasks] = useState({ list: [], total: 0, pageSize: 10 });
  const [nurseTasksPage, setNurseTasksPage] = useState(1);
  const [nurseTasksFilter, setNurseTasksFilter] = useState('all');
  const [nurseTasksLoading, setNurseTasksLoading] = useState(false);
  const [nurseTaskCompletingId, setNurseTaskCompletingId] = useState(null);
  const [nurseNoteModal, setNurseNoteModal] = useState(null); // { taskId, currentNote }
  const [nurseNoteSaving, setNurseNoteSaving] = useState(false);
  const [nurseNewTaskModal, setNurseNewTaskModal] = useState(false);
  const nurseTasksPageSize = 10;

  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryAddQuantityId, setInventoryAddQuantityId] = useState(null);
  const [inventoryAddModal, setInventoryAddModal] = useState(false);

  const [nurseShiftStats, setNurseShiftStats] = useState({
    proceduresCompleted: 0,
    patientsServed: 0,
    workingTimeMinutes: 0,
  });
  const [nurseShiftStatsLoading, setNurseShiftStatsLoading] = useState(false);

  // Данные для администратора (статистика и запросы на утверждение — с бэкенда)
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    usersThisMonth: 0,
    appointmentsToday: 0,
    revenueToday: 0,
    revenueGrowthPercent: 0,
    systemLoad: 67,
    systemLoadLabel: 'Нормальная'
  });
  const [statsLoading, setStatsLoading] = useState(false);

  const [pendingPage, setPendingPage] = useState(1);
  const [pendingRefresh, setPendingRefresh] = useState(0);
  const [pendingRequests, setPendingRequests] = useState({
    list: [],
    total: 0,
    page: 1,
    pageSize: 3
  });
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingActionId, setPendingActionId] = useState(null);

  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityRefresh, setActivityRefresh] = useState(0);
  const [activityPage, setActivityPage] = useState(1);
  const [activityTotal, setActivityTotal] = useState(0);
  const activityPageSize = 10;

  // При каждом переходе на страницу профиля — запрос /info; при 401 interceptor сбросит storage и редирект на /auth
  useEffect(() => {
    refreshUser().catch(() => {});
  }, []);

  // Загрузка записей (визитов) пациента
  useEffect(() => {
    if (currentUser?.type !== 'patient') return;
    let cancelled = false;
    setPatientAppointmentsLoading(true);
    AuthAPI.getMyAppointments(patientAppointments.page, patientAppointments.pageSize)
      .then((res) => {
        if (cancelled) return;
        const list = (res?.list ?? []).map((v) => {
          const doctor = v.pacient?.doctor ?? {};
          const clinicType = doctor.clinicType ?? {};
          return {
            id: v.id,
            date: typeof v.dateVisit === 'string' ? v.dateVisit.slice(0, 10) : (v.dateVisit?.toISOString?.()?.slice(0, 10) ?? ''),
            time: v.time ?? '',
            doctor: doctor.fullName ?? 'Врач',
            specialty: clinicType.name ?? doctor.position ?? '—',
            room: v.roomNumber ?? '—',
            status: v.appointmentStatus === 'confirmed' ? 'confirmed' : v.appointmentStatus === 'cancelled' ? 'cancelled' : 'pending',
          };
        });
        setPatientAppointments((prev) => ({ ...prev, list, total: res?.total ?? 0, page: res?.page ?? 1, pageSize: res?.pageSize ?? 10 }));
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setPatientAppointmentsLoading(false); });
    return () => { cancelled = true; };
  }, [currentUser?.type, patientAppointments.page, patientAppointments.pageSize]);

  // Загрузка истории назначений (препаратов) пациента
  useEffect(() => {
    if (currentUser?.type !== 'patient') return;
    let cancelled = false;
    setPatientPrescriptionsLoading(true);
    AuthAPI.getMyPrescriptions(patientPrescriptions.page, patientPrescriptions.pageSize)
      .then((res) => {
        if (cancelled) return;
        setPatientPrescriptions((prev) => ({
          ...prev,
          list: res?.list ?? [],
          total: res?.total ?? 0,
          page: res?.page ?? 1,
          pageSize: res?.pageSize ?? 10,
        }));
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setPatientPrescriptionsLoading(false); });
    return () => { cancelled = true; };
  }, [currentUser?.type, patientPrescriptions.page, patientPrescriptions.pageSize]);

  // Загрузка баланса пациента
  useEffect(() => {
    if (currentUser?.type !== 'patient') return;
    let cancelled = false;
    setPatientBalanceLoading(true);
    AuthAPI.getMyBalance()
      .then((res) => { if (!cancelled) setPatientBalance(res?.balance ?? 0); })
      .catch(() => { if (!cancelled) setPatientBalance(0); })
      .finally(() => { if (!cancelled) setPatientBalanceLoading(false); });
    return () => { cancelled = true; };
  }, [currentUser?.type]);

  // Загрузка запросов на продление рецептов (для отображения статуса)
  useEffect(() => {
    if (currentUser?.type !== 'patient') return;
    AuthAPI.getMyPrescriptionRenewalRequests()
      .then((res) => setPrescriptionRenewalRequests(res?.list ?? []))
      .catch(() => setPrescriptionRenewalRequests([]));
  }, [currentUser?.type]);

  useEffect(() => {
    if (currentUser) {
      setUserData({
        ...currentUser,
        certificate: currentUser.certificates?.[0] ?? currentUser.license ?? '',
      });
    }
  }, [currentUser]);

  // Загрузка пациентов врача (с пагинацией)
  useEffect(() => {
    if (currentUser?.type !== 'doctor') return;
    let cancelled = false;
    setDoctorPatientsLoading(true);
    AuthAPI.getMyPatients(doctorPatientsPage, doctorPatientsPageSize)
      .then((res) => {
        if (cancelled) return;
        const list = res?.list ?? [];
        const mapped = list.map((item) => {
          const parts = (item.fullName || '').trim().split(/\s+/);
          return {
            id: item.id,
            firstName: parts[0] || '',
            lastName: parts.slice(1).join(' ') || '',
            fullName: item.fullName || '',
            phone: item.phone || '',
            lastVisit: item.lastVisit || '',
            nextAppointment: item.nextAppointment || '',
            complaints: item.description || '',
            medicalHistory: [],
            prescriptions: Array(Math.max(0, item.prescriptionsCount || 0)).fill({}),
            testResults: [],
            attendance: [],
            status: 'active',
          };
        });
        setDoctorPatientsList(mapped);
        setDoctorPatientsTotal(res?.total ?? 0);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setDoctorPatientsLoading(false); });
    return () => { cancelled = true; };
  }, [currentUser?.type, doctorPatientsPage, doctorPatientsPageSize]);

  // Загрузка визитов на сегодня (для врача)
  useEffect(() => {
    if (currentUser?.type !== 'doctor') return;
    let cancelled = false;
    setTodayVisitsLoading(true);
    AuthAPI.getMyVisitsToday(todayVisitsPage, todayVisitsPageSize)
      .then((res) => {
        if (cancelled) return;
        setTodayVisitsList(res?.list ?? []);
        setTodayVisitsTotal(res?.total ?? 0);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setTodayVisitsLoading(false); });
    return () => { cancelled = true; };
  }, [currentUser?.type, todayVisitsPage, todayVisitsPageSize]);

  // Загрузка запросов на продление рецептов (для врача)
  useEffect(() => {
    if (currentUser?.type !== 'doctor') return;
    let cancelled = false;
    setDoctorRenewalRequestsLoading(true);
    AuthAPI.getMyRenewalRequests()
      .then((res) => {
        if (cancelled) return;
        setDoctorRenewalRequests(res?.list ?? []);
      })
      .catch(() => { if (!cancelled) setDoctorRenewalRequests([]); })
      .finally(() => { if (!cancelled) setDoctorRenewalRequestsLoading(false); });
    return () => { cancelled = true; };
  }, [currentUser?.type]);

  // Загрузка назначений и анализов при открытии карточки пациента (врач)
  useEffect(() => {
    if (currentUser?.type !== 'doctor' || !selectedPatient?.id || !isPatientModalOpen) return;
    let cancelled = false;
    setCardDataLoading(true);
    const cardId = selectedPatient.id;
    Promise.all([
      AuthAPI.getCardPrescriptions(cardId),
      AuthAPI.getCardAnalyses(cardId),
    ])
      .then(([presRes, analRes]) => {
        if (cancelled) return;
        const prescriptions = (presRes?.list ?? []).map((p) => ({
          id: p.id,
          medicine: p.prescriptionName ?? '',
          dosage: p.prescriptionDosage ?? '',
          frequency: p.prescriptionFrequency ?? '',
          duration: p.prescriptionTime ?? '',
          notes: p.description ?? '',
          date: p.createdAt ?? '',
          doctor: p.doctorName ?? '',
        }));
        const testResults = (analRes?.list ?? []).map((a) => ({
          id: a.id,
          type: a.type ?? '',
          result: a.text ?? '',
          date: (a.assignedDate || '').slice(0, 10),
          lab: '',
          notes: '',
        }));
        setSelectedPatient((prev) => (prev && prev.id === cardId ? { ...prev, prescriptions, testResults } : prev));
      })
      .catch(() => { if (!cancelled) setSelectedPatient((prev) => prev ? { ...prev, prescriptions: [], testResults: [] } : prev); })
      .finally(() => { if (!cancelled) setCardDataLoading(false); });
    return () => { cancelled = true; };
  }, [currentUser?.type, selectedPatient?.id, isPatientModalOpen]);

  // Загрузка задач медсестры на сегодня
  useEffect(() => {
    if (currentUser?.type !== 'nurse') return;
    let cancelled = false;
    setNurseTasksLoading(true);
    const today = new Date().toISOString().split('T')[0];
    AuthAPI.getMyTasks(nurseTasksPage, nurseTasksPageSize, nurseTasksFilter, today)
      .then((res) => {
        if (cancelled) return;
        setNurseTasks({
          list: res?.list ?? [],
          total: res?.total ?? 0,
          pageSize: res?.pageSize ?? nurseTasksPageSize,
        });
      })
      .catch(() => { if (!cancelled) setNurseTasks((p) => ({ ...p, list: [] })); })
      .finally(() => { if (!cancelled) setNurseTasksLoading(false); });
    return () => { cancelled = true; };
  }, [currentUser?.type, nurseTasksPage, nurseTasksFilter]);

  const fetchInventory = React.useCallback(() => {
    if (currentUser?.type !== 'nurse') return;
    setInventoryLoading(true);
    AuthAPI.getMyInventory()
      .then((res) => setInventory(res?.list ?? []))
      .catch(() => setInventory([]))
      .finally(() => setInventoryLoading(false));
  }, [currentUser?.type]);

  useEffect(() => {
    if (currentUser?.type !== 'nurse') return;
    fetchInventory();
  }, [currentUser?.type, fetchInventory]);

  const fetchNurseShiftStats = React.useCallback(() => {
    if (currentUser?.type !== 'nurse') return;
    setNurseShiftStatsLoading(true);
    const today = new Date().toISOString().split('T')[0];
    AuthAPI.getMyShiftStats(today)
      .then((data) =>
        setNurseShiftStats({
          proceduresCompleted: data?.proceduresCompleted ?? 0,
          patientsServed: data?.patientsServed ?? 0,
          workingTimeMinutes: data?.workingTimeMinutes ?? 0,
        })
      )
      .catch(() => setNurseShiftStats({ proceduresCompleted: 0, patientsServed: 0, workingTimeMinutes: 0 }))
      .finally(() => setNurseShiftStatsLoading(false));
  }, [currentUser?.type]);

  useEffect(() => {
    if (currentUser?.type !== 'nurse') return;
    fetchNurseShiftStats();
  }, [currentUser?.type, fetchNurseShiftStats]);

  const downloadShiftReport = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { list } = await AuthAPI.getMyShiftJournal(today);
      const rows = (list || []).map((t) => [
        t.patientName,
        t.description,
        t.room || '',
        t.scheduledTime,
        t.priority,
        t.status,
        t.completedAt || '',
      ]);
      const header = ['Пациент', 'Процедура', 'Палата', 'Время', 'Приоритет', 'Статус', 'Выполнено'];
      const csv = [header, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `сменный-отчет-${today}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      openInfo({ title: 'Готово', message: 'Сменный отчёт скачан.', variant: 'success' });
    } catch (e) {
      openInfo({ title: 'Ошибка', message: e?.response?.data?.message || 'Не удалось сформировать отчёт.', variant: 'error' });
    }
  };

  const downloadShiftJournal = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { list } = await AuthAPI.getMyShiftJournal(today);
      const rows = (list || []).map((t) => [
        t.id,
        t.patientName,
        t.description,
        t.room || '',
        t.scheduledTime,
        t.priority,
        t.status,
        t.completedAt || '',
      ]);
      const header = ['ID', 'Пациент', 'Процедура', 'Палата', 'Время', 'Приоритет', 'Статус', 'Выполнено'];
      const csv = [header, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `журнал-задач-${today}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      openInfo({ title: 'Готово', message: 'Журнал скачан.', variant: 'success' });
    } catch (e) {
      openInfo({ title: 'Ошибка', message: e?.response?.data?.message || 'Не удалось скачать журнал.', variant: 'error' });
    }
  };

  // Загрузка списка пациентов в модалке выбора (для назначение/анализы)
  useEffect(() => {
    if (currentUser?.type !== 'doctor' || (quickActionType !== 'prescription' && quickActionType !== 'analysis')) return;
    let cancelled = false;
    setModalPatientLoading(true);
    AuthAPI.getMyPatients(modalPatientPage, modalPatientPageSize, modalPatientSearch)
      .then((res) => {
        if (cancelled) return;
        setModalPatientList(res?.list ?? []);
        setModalPatientTotal(res?.total ?? 0);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setModalPatientLoading(false); });
    return () => { cancelled = true; };
  }, [currentUser?.type, quickActionType, modalPatientPage, modalPatientPageSize, modalPatientSearch]);

  // Загрузка визитов в модалке «Отменить посещение»
  useEffect(() => {
    if (currentUser?.type !== 'doctor' || quickActionType !== 'cancel') return;
    let cancelled = false;
    setCancelVisitsLoading(true);
    AuthAPI.getMyVisitsToday(cancelVisitsPage, cancelVisitsPageSize)
      .then((res) => {
        if (cancelled) return;
        setCancelVisitsList(res?.list ?? []);
        setCancelVisitsTotal(res?.total ?? 0);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setCancelVisitsLoading(false); });
    return () => { cancelled = true; };
  }, [currentUser?.type, quickActionType, cancelVisitsPage, cancelVisitsPageSize]);

  // Загрузка статистики и запросов на утверждение для администратора
  useEffect(() => {
    if (!currentUser?.isAdmin) return;
    let cancelled = false;
    setStatsLoading(true);
    AdminAPI.getStats()
      .then((data) => {
        if (!cancelled) {
          setSystemStats({
            totalUsers: data.totalUsers ?? 0,
            usersThisMonth: data.usersThisMonth ?? 0,
            appointmentsToday: data.appointmentsToday ?? 0,
            revenueToday: data.revenueToday ?? 0,
            revenueGrowthPercent: data.revenueGrowthPercent ?? 0,
            systemLoad: data.systemLoad ?? 67,
            systemLoadLabel: data.systemLoadLabel ?? 'Нормальная'
          });
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setStatsLoading(false); });
    return () => { cancelled = true; };
  }, [currentUser?.isAdmin]);

  const pageSize = 3;
  useEffect(() => {
    if (!currentUser?.isAdmin) return;
    let cancelled = false;
    setPendingLoading(true);
    AdminAPI.getPendingApproval(pendingPage, pageSize)
      .then((data) => {
        if (!cancelled) {
          setPendingRequests({
            list: data.list ?? [],
            total: data.total ?? 0,
            page: data.page ?? pendingPage,
            pageSize: data.pageSize ?? pageSize
          });
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setPendingLoading(false); });
    return () => { cancelled = true; };
  }, [currentUser?.isAdmin, pendingPage, pendingRefresh]);

  // Загрузка активности системы для администратора (с пагинацией)
  useEffect(() => {
    if (!currentUser?.isAdmin) return;
    let cancelled = false;
    setActivityLoading(true);
    AdminAPI.getActivitiesPage(activityPage, activityPageSize)
      .then((res) => {
        if (cancelled) return;
        const list = res?.list ?? [];
        const items = Array.isArray(list)
          ? list.map((a) => ({
              id: a.id,
              action: a.eventType,
              user: a.user ?? 'Система',
              time: a.time ?? ''
            }))
          : [];
        setRecentActivity(items);
        setActivityTotal(res?.total ?? 0);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setActivityLoading(false); });
    return () => { cancelled = true; };
  }, [currentUser?.isAdmin, activityPage, activityPageSize, activityRefresh]);

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
    const certificates = userData.certificate != null && String(userData.certificate).trim()
      ? [String(userData.certificate).trim()]
      : (currentUser.certificates ?? []);
    try {
      await AuthAPI.updateProfile({
        fullName: fullName || undefined,
        email: userData.email || undefined,
        phone: userData.phone || undefined,
        policyNumber: userData.policyNumber ?? currentUser.policyNumber ?? undefined,
        certificates: certificates,
        position: userData.position ?? currentUser.position ?? undefined,
      });
      const fresh = await refreshUser();
      setUserData((prev) => ({ ...prev, ...fresh, certificate: fresh?.certificates?.[0] ?? fresh?.license ?? prev.certificate }));
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

  const addPrescription = async () => {
    if (!selectedPatient?.id || !newPrescription.medicine || !newPrescription.dosage) return;
    setCardPrescriptionSaving(true);
    try {
      await AuthAPI.createPrescription({
        pacientId: selectedPatient.id,
        prescriptionName: newPrescription.medicine,
        prescriptionDosage: newPrescription.dosage,
        prescriptionFrequency: newPrescription.frequency || '',
        prescriptionTime: newPrescription.duration || '',
        description: newPrescription.notes || '',
      });
      openInfo({ title: 'Готово', message: 'Назначение добавлено.', variant: 'success' });
      setNewPrescription({ medicine: '', dosage: '', frequency: '', duration: '', notes: '' });
      const res = await AuthAPI.getCardPrescriptions(selectedPatient.id);
      const prescriptions = (res?.list ?? []).map((p) => ({
        id: p.id,
        medicine: p.prescriptionName ?? '',
        dosage: p.prescriptionDosage ?? '',
        frequency: p.prescriptionFrequency ?? '',
        duration: p.prescriptionTime ?? '',
        notes: p.description ?? '',
        date: p.createdAt ?? '',
        doctor: p.doctorName ?? '',
      }));
      setSelectedPatient((prev) => (prev ? { ...prev, prescriptions } : prev));
    } catch (e) {
      openInfo({ title: 'Ошибка', message: e?.response?.data?.message || 'Не удалось добавить назначение.', variant: 'error' });
    } finally {
      setCardPrescriptionSaving(false);
    }
  };

  const addTestResult = async () => {
    if (!selectedPatient?.id || !newTest.type || !newTest.result) return;
    setCardAnalysisSaving(true);
    try {
      await AuthAPI.createAnalysis({
        pacientId: selectedPatient.id,
        type: newTest.type,
        text: newTest.result,
        assignedDate: newTest.date || new Date().toISOString().split('T')[0],
        costs: newTest.costs ? parseFloat(newTest.costs) : undefined,
      });
      openInfo({ title: 'Готово', message: 'Результат анализа добавлен.', variant: 'success' });
      setNewTest({ type: '', result: '', date: new Date().toISOString().split('T')[0], lab: '', notes: '', costs: '' });
      const res = await AuthAPI.getCardAnalyses(selectedPatient.id);
      const testResults = (res?.list ?? []).map((a) => ({
        id: a.id,
        type: a.type ?? '',
        result: a.text ?? '',
        date: (a.assignedDate || '').slice(0, 10),
        lab: '',
        notes: '',
      }));
      setSelectedPatient((prev) => (prev ? { ...prev, testResults } : prev));
    } catch (e) {
      openInfo({ title: 'Ошибка', message: e?.response?.data?.message || 'Не удалось добавить анализ.', variant: 'error' });
    } finally {
      setCardAnalysisSaving(false);
    }
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

  const patientsSource = currentUser?.type === 'doctor' ? doctorPatientsList : patients;
  const filteredPatients = patientsSource.filter(patient =>
    `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.phone || '').includes(searchTerm)
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
      openInfo({ title: 'Перенос записи', message: `Перенос записи к ${appointment.doctor}`, variant: 'info' });
    }
  };

  /** Скачать CSV по назначению (препарату). */
  const downloadPrescriptionCsv = (prescription) => {
    const rows = [
      ['Тип', 'Назначение (препарат)'],
      ['Препарат', prescription.prescriptionName ?? ''],
      ['Дозировка', prescription.prescriptionDosage ?? ''],
      ['Частота приёма', prescription.prescriptionFrequency ?? ''],
      ['Время приёма', prescription.prescriptionTime ?? ''],
      ['Описание', prescription.description ?? ''],
      ['Врач', prescription.doctorName ?? ''],
      ['Специальность', prescription.doctorSpecialty ?? ''],
    ];
    const csv = '\uFEFF' + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `назначение_${prescription.prescriptionName ?? prescription.id}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    openInfo({ title: 'Скачивание', message: 'Файл CSV сохранён.', variant: 'success' });
  };

  /** Распечатать / сохранить CSV отчёт по назначению. */
  const printPrescriptionCsv = (prescription) => {
    const rows = [
      ['Тип', 'Назначение (препарат)'],
      ['Препарат', prescription.prescriptionName ?? ''],
      ['Дозировка', prescription.prescriptionDosage ?? ''],
      ['Частота приёма', prescription.prescriptionFrequency ?? ''],
      ['Время приёма', prescription.prescriptionTime ?? ''],
      ['Описание', prescription.description ?? ''],
      ['Врач', prescription.doctorName ?? ''],
      ['Специальность', prescription.doctorSpecialty ?? ''],
    ];
    const csv = '\uFEFF' + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    if (w) w.document.title = `Назначение_${prescription.prescriptionName ?? prescription.id}`;
    else {
      const a = document.createElement('a');
      a.href = url;
      a.download = `отчет_назначение_${prescription.id}.csv`;
      a.click();
    }
    URL.revokeObjectURL(url);
    openInfo({ title: 'Отчёт', message: 'Открыт отчёт в новой вкладке или сохранён как CSV.', variant: 'success' });
  };

  /** Запрос на продление рецепта (API). */
  const requestPrescriptionRenewal = (prescriptionId) => {
    const pending = prescriptionRenewalRequests.some(
      (r) => (r.prescription?.id ?? r.prescriptionId) === prescriptionId && (r.status === 'pending' || r.status === 'approved')
    );
    if (pending) {
      openInfo({ title: 'Продление рецепта', message: 'Запрос уже отправлен или одобрен.', variant: 'info' });
      return;
    }
    setRenewRequestSending(prescriptionId);
    AuthAPI.createPrescriptionRenewalRequest(prescriptionId)
      .then(() => {
        openInfo({ title: 'Запрос отправлен', message: 'Запрос на продление рецепта отправлен врачу. Ожидайте решения.', variant: 'success' });
        return AuthAPI.getMyPrescriptionRenewalRequests();
      })
      .then((res) => setPrescriptionRenewalRequests(res?.list ?? []))
      .catch((err) => {
        openInfo({
          title: 'Ошибка',
          message: err?.response?.data?.message ?? 'Не удалось отправить запрос на продление.',
          variant: 'error',
        });
      })
      .finally(() => setRenewRequestSending(null));
  };

  const downloadMedicalRecord = (id) => {
    const record = patientRecords.find(r => r.id === id);
    if (record) {
      openInfo({ title: 'Скачивание', message: `Скачивание записи от ${record.date}`, variant: 'info' });
    }
  };

  // Функционал для медсестры
  const completeTask = async (id) => {
    setNurseTaskCompletingId(id);
    try {
      await AuthAPI.completeMyTask(id);
      openInfo({ title: 'Готово', message: 'Задача отмечена выполненной.', variant: 'success' });
      const today = new Date().toISOString().split('T')[0];
      const res = await AuthAPI.getMyTasks(nurseTasksPage, nurseTasksPageSize, nurseTasksFilter, today);
      setNurseTasks({ list: res?.list ?? [], total: res?.total ?? 0, pageSize: res?.pageSize ?? nurseTasksPageSize });
      fetchNurseShiftStats();
    } catch (e) {
      openInfo({ title: 'Ошибка', message: e?.response?.data?.message || 'Не удалось отметить задачу.', variant: 'error' });
    } finally {
      setNurseTaskCompletingId(null);
    }
  };

  const openTaskNoteModal = (taskId, currentNote) => {
    setNurseNoteModal({ taskId, currentNote: currentNote || '' });
  };

  const saveTaskNote = async () => {
    if (!nurseNoteModal?.taskId) return;
    setNurseNoteSaving(true);
    try {
      await AuthAPI.setMyTaskNote(nurseNoteModal.taskId, nurseNoteModal.currentNote);
      openInfo({ title: 'Готово', message: 'Заметка сохранена.', variant: 'success' });
      setNurseNoteModal(null);
      const today = new Date().toISOString().split('T')[0];
      const res = await AuthAPI.getMyTasks(nurseTasksPage, nurseTasksPageSize, nurseTasksFilter, today);
      setNurseTasks({ list: res?.list ?? [], total: res?.total ?? 0, pageSize: res?.pageSize ?? nurseTasksPageSize });
    } catch (e) {
      openInfo({ title: 'Ошибка', message: e?.response?.data?.message || 'Не удалось сохранить заметку.', variant: 'error' });
    } finally {
      setNurseNoteSaving(false);
    }
  };

  const addInventoryQuantity = async (id, amount = 10) => {
    setInventoryAddQuantityId(id);
    try {
      await AuthAPI.addInventoryQuantity(id, amount);
      openInfo({ title: 'Готово', message: 'Количество обновлено.', variant: 'success' });
      fetchInventory();
    } catch (e) {
      openInfo({ title: 'Ошибка', message: e?.response?.data?.message || 'Не удалось обновить количество.', variant: 'error' });
    } finally {
      setInventoryAddQuantityId(null);
    }
  };

  const requestSupply = (itemName) => {
    openInfo({ title: 'Запрос на пополнение', message: `Запрос на пополнение: ${itemName}`, variant: 'info' });
  };

  // Функционал для администратора: утверждение/отклонение регистрации
  const approveRequest = async (id) => {
    setPendingActionId(id);
    try {
      await AdminAPI.approveUser(id);
      setPendingRefresh((r) => r + 1);
      setActivityPage(1);
      setActivityRefresh((r) => r + 1);
      AdminAPI.getStats().then((data) => {
        setSystemStats({
          totalUsers: data.totalUsers ?? 0,
          usersThisMonth: data.usersThisMonth ?? 0,
          appointmentsToday: data.appointmentsToday ?? 0,
          revenueToday: data.revenueToday ?? 0,
          revenueGrowthPercent: data.revenueGrowthPercent ?? 0,
          systemLoad: data.systemLoad ?? 67,
          systemLoadLabel: data.systemLoadLabel ?? 'Нормальная'
        });
      }).catch(() => {});
    } catch (_e) {
      // ошибка уже обработана interceptor'ом
    } finally {
      setPendingActionId(null);
    }
  };

  const rejectRequest = async (id) => {
    setPendingActionId(id);
    try {
      await AdminAPI.rejectUser(id);
      setPendingRefresh((r) => r + 1);
      setActivityPage(1);
      setActivityRefresh((r) => r + 1);
    } catch (_e) {
      // ошибка уже обработана interceptor'ом
    } finally {
      setPendingActionId(null);
    }
  };

  const generateReport = async (type) => {
    const key = `report-${type}`;
    setAdminActionLoading(key);
    try {
      const result = await AdminAPI.getReport(type);
      const data = result?.data ?? {};
      const dateStr = result?.generatedAt
        ? new Date(result.generatedAt).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);
      let csvString;
      let filename;
      if (type === 'users') {
        csvString = buildUsersReportCsv(data);
        filename = `otchet-polzovateli-${dateStr}.csv`;
      } else if (type === 'medical') {
        csvString = buildMedicalReportCsv(data);
        filename = `meditsinskiy-otchet-${dateStr}.csv`;
      } else {
        csvString = buildFinancialReportCsv(data);
        filename = `finansovyy-otchet-${dateStr}.csv`;
      }
      downloadCsv(filename, csvString);
      setActivityPage(1);
      setActivityRefresh((r) => r + 1);
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Не удалось сформировать отчёт';
      openInfo({ title: 'Ошибка', message: typeof msg === 'string' ? msg : 'Ошибка формирования отчёта', variant: 'error' });
    } finally {
      setAdminActionLoading(null);
    }
  };

  const backupSystem = async () => {
    setAdminActionLoading('backup');
    try {
      const result = await AdminAPI.backup();
      openInfo({ title: 'Резервная копия', message: result?.message ?? 'Резервная копия запущена.', variant: 'success' });
      setActivityPage(1);
      setActivityRefresh((r) => r + 1);
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Ошибка запуска резервного копирования';
      openInfo({ title: 'Ошибка', message: typeof msg === 'string' ? msg : 'Ошибка', variant: 'error' });
    } finally {
      setAdminActionLoading(null);
    }
  };

  const clearCache = async () => {
    setAdminActionLoading('cache');
    try {
      const result = await AdminAPI.clearCache();
      openInfo({ title: 'Очистка кэша', message: result?.message ?? 'Кэш очищен.', variant: 'success' });
      setActivityPage(1);
      setActivityRefresh((r) => r + 1);
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Ошибка очистки кэша';
      openInfo({ title: 'Ошибка', message: typeof msg === 'string' ? msg : 'Ошибка', variant: 'error' });
    } finally {
      setAdminActionLoading(null);
    }
  };

  const checkSecurity = async () => {
    setAdminActionLoading('security');
    try {
      const result = await AdminAPI.checkSecurity();
      if (result?.ok) {
        openInfo({ title: 'Безопасность', message: 'Проверка безопасности пройдена. Замечаний нет.', variant: 'success' });
      } else {
        const issues = result?.issues?.length ? result.issues.join('\n') : 'Обнаружены замечания';
        openInfo({ title: 'Проверка безопасности', message: issues, variant: 'info' });
      }
      setActivityPage(1);
      setActivityRefresh((r) => r + 1);
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Ошибка проверки безопасности';
      openInfo({ title: 'Ошибка', message: typeof msg === 'string' ? msg : 'Ошибка', variant: 'error' });
    } finally {
      setAdminActionLoading(null);
    }
  };

  const openResetPasswordsModal = () => {
    setResetPasswordsNew('');
    setResetPasswordsConfirm('');
    setResetPasswordsError('');
    setResetPasswordsSuccess('');
    setShowResetNew(false);
    setShowResetConfirm(false);
    setIsResetPasswordsModalOpen(true);
  };

  const closeResetPasswordsModal = () => {
    setIsResetPasswordsModalOpen(false);
    setResetPasswordsNew('');
    setResetPasswordsConfirm('');
    setResetPasswordsError('');
    setResetPasswordsSuccess('');
  };

  const handleResetDoctorsPassword = async (e) => {
    e.preventDefault();
    setResetPasswordsError('');
    setResetPasswordsSuccess('');
    const pwd = resetPasswordsNew.trim();
    const conf = resetPasswordsConfirm.trim();
    if (pwd.length < 6) {
      setResetPasswordsError('Пароль должен быть не менее 6 символов');
      return;
    }
    if (pwd !== conf) {
      setResetPasswordsError('Пароли не совпадают');
      return;
    }
    setResetPasswordsSaving(true);
    try {
      const result = await AdminAPI.resetDoctorsPassword(pwd);
      setResetPasswordsSuccess(result?.message ?? `Пароль установлен для ${result?.updated ?? 0} врачей.`);
      setResetPasswordsNew('');
      setResetPasswordsConfirm('');
      setActivityPage(1);
      setActivityRefresh((r) => r + 1);
      setTimeout(() => closeResetPasswordsModal(), 2000);
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Не удалось сбросить пароли';
      setResetPasswordsError(typeof msg === 'string' ? msg : 'Ошибка сброса паролей');
    } finally {
      setResetPasswordsSaving(false);
    }
  };

  const patientCardModalContent = selectedPatient && (
      <div className={`patient-modal-overlay ${isPatientModalOpen ? 'active' : ''}`}>
        <div className="patient-modal">
          <div className="patient-modal-header">
            <div>
              <h3 className="patient-modal-title">
                Карточка пациента: {selectedPatient.fullName || `${selectedPatient.firstName || ''} ${selectedPatient.lastName || ''}`.trim() || 'Пациент'}
              </h3>
              <div className="patient-modal-subtitle">
                <span>Телефон: {selectedPatient.phone || '—'}</span>
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
                    {(selectedPatient.medicalHistory ?? []).length > 0 ? (
                      (selectedPatient.medicalHistory ?? []).map((record, idx) => (
                        <div key={record.id ?? idx} className="medical-history-item">
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
                    {(selectedPatient.prescriptions ?? []).filter(p => p && p.doctor !== `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim()).length > 0 ? (
                      (selectedPatient.prescriptions ?? [])
                        .filter(p => p && p.doctor !== `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim())
                        .map((prescription, idx) => (
                          <div key={prescription.id ?? idx} className="other-prescription">
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
                    {cardDataLoading ? (
                      <p className="profile-loading-msg">Загрузка…</p>
                    ) : (selectedPatient.prescriptions ?? []).length > 0 ? (
                      (selectedPatient.prescriptions ?? []).map((prescription, idx) => (
                        <div key={prescription.id ?? idx} className="prescription-item">
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
                      <button type="button" onClick={addPrescription} className="add-button" disabled={cardPrescriptionSaving}>
                        <Plus size={16} />
                        {cardPrescriptionSaving ? 'Сохранение…' : 'Добавить назначение'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tests' && (
                <div className="patient-tests">
                  <div className="tests-list">
                    <h4>Результаты анализов</h4>
                    {cardDataLoading ? (
                      <p className="profile-loading-msg">Загрузка…</p>
                    ) : (selectedPatient.testResults ?? []).length > 0 ? (
                      (selectedPatient.testResults ?? []).map((test, idx) => (
                        <div key={test.id ?? idx} className="test-item">
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
                      <button type="button" onClick={addTestResult} className="add-button" disabled={cardAnalysisSaving}>
                        <Plus size={16} />
                        {cardAnalysisSaving ? 'Сохранение…' : 'Добавить результат'}
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
                        {(selectedPatient.attendance ?? []).filter(a => a && a.status === 'attended').length}
                      </div>
                      <div className="stat-label">Посещений</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">
                        {(selectedPatient.attendance ?? []).filter(a => a && a.status === 'missed').length}
                      </div>
                      <div className="stat-label">Пропусков</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">
                        {(selectedPatient.attendance ?? []).filter(a => a && a.status === 'cancelled').length}
                      </div>
                      <div className="stat-label">Отмен</div>
                    </div>
                  </div>

                  <div className="attendance-list">
                    <h4>История посещений</h4>
                    {(selectedPatient.attendance ?? []).length > 0 ? (
                      (selectedPatient.attendance ?? []).map((record, index) => (
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
          {patientAppointmentsLoading && patientAppointments.list.length === 0 ? (
            <div className="profile-loading-msg">Загрузка записей…</div>
          ) : patientAppointments.list.length === 0 ? (
            <div className="profile-empty-msg">У вас пока нет записей к врачам.</div>
          ) : (
            patientAppointments.list.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <div className="appointment-date-badge">
                    <div className="appointment-day">{new Date(appointment.date + 'T12:00:00').getDate()}</div>
                    <div className="appointment-month">
                      {new Date(appointment.date + 'T12:00:00').toLocaleString('ru-RU', { month: 'short' })}
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
                      {appointment.status === 'confirmed' ? 'Подтверждено' : appointment.status === 'cancelled' ? 'Отменено' : 'Ожидает подтверждения'}
                    </div>
                  </div>
                </div>
                {appointment.status !== 'cancelled' && (
                  <div className="appointment-actions">
                    <button className="appointment-action-btn secondary" onClick={() => rescheduleAppointment(appointment.id)}>
                      <Calendar size={14} />
                      Перенести
                    </button>
                    <button className="appointment-action-btn danger" onClick={() => cancelAppointment(appointment.id)}>
                      <X size={14} />
                      Отменить
                    </button>
                    <button className="appointment-action-btn">
                      <MessageSquare size={14} />
                      Написать врачу
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        {patientAppointments.total > patientAppointments.pageSize && (
          <div className="profile-pagination-inline" style={{ marginTop: '1rem' }}>
            <span>
              {((patientAppointments.page - 1) * patientAppointments.pageSize) + 1}–
              {Math.min(patientAppointments.page * patientAppointments.pageSize, patientAppointments.total)} из {patientAppointments.total}
            </span>
            <button
              type="button"
              className="profile-pagination-btn"
              disabled={patientAppointmentsLoading || patientAppointments.page <= 1}
              onClick={() => setPatientAppointments((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
            >
              Назад
            </button>
            <span>Стр. {patientAppointments.page} из {Math.max(1, Math.ceil(patientAppointments.total / patientAppointments.pageSize))}</span>
            <button
              type="button"
              className="profile-pagination-btn"
              disabled={patientAppointmentsLoading || patientAppointments.page >= Math.ceil(patientAppointments.total / patientAppointments.pageSize)}
              onClick={() => setPatientAppointments((p) => ({ ...p, page: p.page + 1 }))}
            >
              Вперёд
            </button>
          </div>
        )}
      </div>

      <div className="profile-content-block">
        <div className="profile-section-header">
          <h3 className="profile-section-title">
            <Heart size={18} />
            История препаратов
          </h3>
          <button className="profile-section-action" onClick={() => openInfo({ title: 'История препаратов', message: 'Список выписанных назначений.', variant: 'info' })}>
            <History size={16} />
            Вся история
          </button>
        </div>
        
        <div className="medical-records">
          {patientPrescriptionsLoading && patientPrescriptions.list.length === 0 ? (
            <div className="profile-loading-msg">Загрузка назначений…</div>
          ) : patientPrescriptions.list.length === 0 ? (
            <div className="profile-empty-msg">Назначений пока нет.</div>
          ) : (
            patientPrescriptions.list.map((record) => {
              const hasPendingRenewal = prescriptionRenewalRequests.some(
                (r) => (r.prescription?.id ?? r.prescriptionId) === record.id && (r.status === 'pending' || r.status === 'approved')
              );
              return (
                <div key={record.id} className="medical-record-card">
                  <div className="record-header">
                    <div className="record-doctor">{record.doctorName} {record.doctorSpecialty ? `(${record.doctorSpecialty})` : ''}</div>
                    <div className={`record-status record-status-${hasPendingRenewal ? 'active' : 'completed'}`}>
                      {hasPendingRenewal ? 'Запрос на продление отправлен' : 'Назначение'}
                    </div>
                  </div>
                  <div className="record-info">
                    <div className="record-diagnosis">{record.prescriptionName}</div>
                    <div className="record-prescription">
                      {record.prescriptionDosage}, {record.prescriptionFrequency}, {record.prescriptionTime}. {record.description ? record.description : ''}
                    </div>
                  </div>
                  <div className="record-actions">
                    <button type="button" className="record-action-btn" onClick={() => downloadPrescriptionCsv(record)}>
                      <Download size={14} />
                      Скачать CSV
                    </button>
                    <button
                      type="button"
                      className="record-action-btn"
                      disabled={renewRequestSending === record.id || hasPendingRenewal}
                      onClick={() => requestPrescriptionRenewal(record.id)}
                    >
                      <FileEdit size={14} />
                      {renewRequestSending === record.id ? 'Отправка…' : hasPendingRenewal ? 'Запрос отправлен' : 'Продлить рецепт'}
                    </button>
                    <button type="button" className="record-action-btn" onClick={() => printPrescriptionCsv(record)}>
                      <Printer size={14} />
                      Распечатать CSV
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {patientPrescriptions.total > patientPrescriptions.pageSize && (
          <div className="profile-pagination-inline" style={{ marginTop: '1rem' }}>
            <span>
              {((patientPrescriptions.page - 1) * patientPrescriptions.pageSize) + 1}–
              {Math.min(patientPrescriptions.page * patientPrescriptions.pageSize, patientPrescriptions.total)} из {patientPrescriptions.total}
            </span>
            <button
              type="button"
              className="profile-pagination-btn"
              disabled={patientPrescriptionsLoading || patientPrescriptions.page <= 1}
              onClick={() => setPatientPrescriptions((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
            >
              Назад
            </button>
            <span>Стр. {patientPrescriptions.page} из {Math.max(1, Math.ceil(patientPrescriptions.total / patientPrescriptions.pageSize))}</span>
            <button
              type="button"
              className="profile-pagination-btn"
              disabled={patientPrescriptionsLoading || patientPrescriptions.page >= Math.ceil(patientPrescriptions.total / patientPrescriptions.pageSize)}
              onClick={() => setPatientPrescriptions((p) => ({ ...p, page: p.page + 1 }))}
            >
              Вперёд
            </button>
          </div>
        )}
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
              <div className="finance-card-amount">
                {patientBalanceLoading ? '…' : `${Number(patientBalance ?? 0).toLocaleString('ru-RU')} ₽`}
              </div>
              <div className="finance-card-subtitle">На счету</div>
              <button type="button" className="finance-card-btn" onClick={() => openInfo({ title: 'Пополнение', message: 'Функция пополнения счёта в разработке.', variant: 'info' })}>
                Пополнить
              </button>
            </div>
            <div className="finance-card">
              <div className="finance-card-title">Последний платеж</div>
              <div className="finance-card-amount">—</div>
              <div className="finance-card-subtitle">Нет данных</div>
              <button type="button" className="finance-card-btn secondary" onClick={() => openInfo({ title: 'Квитанция', message: 'История платежей в разработке.', variant: 'info' })}>
                Квитанция
              </button>
            </div>
          </div>
          <div className="payment-history">
            <h4>История платежей</h4>
            <div className="payment-list">
              <div className="profile-empty-msg">История платежей пока пуста.</div>
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
          <button
            type="button"
            className="profile-section-action"
            onClick={() => setNurseNewTaskModal(true)}
          >
            <Plus size={16} />
            Новая задача
          </button>
        </div>
        
        <div className="tasks-panel">
          <div className="tasks-filters">
            <button
              type="button"
              className={`filter-btn ${nurseTasksFilter === 'all' ? 'active' : ''}`}
              onClick={() => { setNurseTasksFilter('all'); setNurseTasksPage(1); }}
            >
              Все{nurseTasksFilter === 'all' ? ` (${nurseTasks.total})` : ''}
            </button>
            <button
              type="button"
              className={`filter-btn ${nurseTasksFilter === 'high_priority' ? 'active' : ''}`}
              onClick={() => { setNurseTasksFilter('high_priority'); setNurseTasksPage(1); }}
            >
              Высокий приоритет{nurseTasksFilter === 'high_priority' ? ` (${nurseTasks.total})` : ''}
            </button>
            <button
              type="button"
              className={`filter-btn ${nurseTasksFilter === 'completed' ? 'active' : ''}`}
              onClick={() => { setNurseTasksFilter('completed'); setNurseTasksPage(1); }}
            >
              Завершенные{nurseTasksFilter === 'completed' ? ` (${nurseTasks.total})` : ''}
            </button>
          </div>
          
          <div className="tasks-list">
            {nurseTasksLoading ? (
              <div className="profile-loading-msg">Загрузка задач…</div>
            ) : nurseTasks.list.length === 0 ? (
              <div className="profile-empty-msg">Нет задач на сегодня.</div>
            ) : (
              nurseTasks.list.map((task) => (
                <div key={task.id} className={`task-card task-priority-${task.priority || 'normal'}`}>
                  <div className="task-header">
                    <div className="task-patient">
                      <User size={14} />
                      {task.patientName}
                    </div>
                    <div className="task-time">{task.scheduledTime}</div>
                  </div>
                  <div className="task-content">
                    <div className="task-procedure">{task.description}</div>
                    <div className="task-room">{task.room || '—'}</div>
                    {task.note && (
                      <div className="task-note">{task.note}</div>
                    )}
                  </div>
                  <div className="task-actions">
                    {task.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          className="task-action-btn success"
                          disabled={nurseTaskCompletingId === task.id}
                          onClick={() => completeTask(task.id)}
                        >
                          <CheckCircle size={14} />
                          {nurseTaskCompletingId === task.id ? '…' : 'Выполнено'}
                        </button>
                        <button
                          type="button"
                          className="task-action-btn"
                          onClick={() => openTaskNoteModal(task.id, task.note)}
                        >
                          <Edit3 size={14} />
                          Заметка
                        </button>
                      </>
                    ) : (
                      <div className="task-completed">
                        <CheckCircle size={14} />
                        Выполнено{task.completedAt ? ` в ${task.completedAt.slice(11, 16)}` : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {nurseTasks.total > nurseTasksPageSize && (
            <div className="doctor-patients-pagination" style={{ marginTop: '1rem' }}>
              <span className="doctor-patients-pagination-info">
                {((nurseTasksPage - 1) * nurseTasksPageSize) + 1}–{Math.min(nurseTasksPage * nurseTasksPageSize, nurseTasks.total)} из {nurseTasks.total}
              </span>
              <div className="doctor-patients-pagination-buttons">
                <button
                  type="button"
                  className="doctor-patients-pagination-btn"
                  disabled={nurseTasksLoading || nurseTasksPage <= 1}
                  onClick={() => setNurseTasksPage((p) => Math.max(1, p - 1))}
                >
                  Назад
                </button>
                <span className="doctor-patients-pagination-page">
                  Страница {nurseTasksPage} из {Math.max(1, Math.ceil(nurseTasks.total / nurseTasksPageSize))}
                </span>
                <button
                  type="button"
                  className="doctor-patients-pagination-btn"
                  disabled={nurseTasksLoading || nurseTasksPage >= Math.ceil(nurseTasks.total / nurseTasksPageSize)}
                  onClick={() => setNurseTasksPage((p) => p + 1)}
                >
                  Вперёд
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content-block">
        <div className="profile-section-header">
          <h3 className="profile-section-title">
            <ClipboardList size={18} />
            Инвентарь и расходники
          </h3>
          <button
            type="button"
            className="profile-section-action"
            onClick={() => setInventoryAddModal(true)}
          >
            <Plus size={16} />
            Добавить позицию
          </button>
        </div>
        
        <div className="inventory-panel">
          <div className="inventory-summary">
            <div className="inventory-stat">
              <div className="stat-value">{inventoryLoading ? '—' : inventory.length}</div>
              <div className="stat-label">Позиций</div>
            </div>
            <div className="inventory-stat warning">
              <div className="stat-value">
                {inventoryLoading ? '—' : inventory.filter((item) => item.quantity <= item.threshold).length}
              </div>
              <div className="stat-label">Требуют пополнения</div>
            </div>
          </div>
          
          <div className="inventory-list">
            {inventoryLoading ? (
              <div className="profile-loading-msg">Загрузка инвентаря…</div>
            ) : inventory.length === 0 ? (
              <div className="profile-empty-msg">Нет позиций. Добавьте первую.</div>
            ) : (
              inventory.map((item) => (
                <div key={item.id} className={`inventory-item ${item.quantity <= item.threshold ? 'low-stock' : ''}`}>
                  <div className="inventory-info">
                    <div className="inventory-name">{item.name}</div>
                    <div className="inventory-quantity">
                      Количество: <span>{item.quantity}</span>
                    </div>
                    <div className="inventory-threshold">
                      Минимальный запас: {item.threshold}
                    </div>
                  </div>
                  <div className="inventory-actions">
                    <button
                      type="button"
                      className="inventory-action-btn"
                      disabled={inventoryAddQuantityId === item.id}
                      onClick={() => addInventoryQuantity(item.id, 10)}
                    >
                      <Plus size={14} />
                      {inventoryAddQuantityId === item.id ? '…' : 'Добавить'}
                    </button>
                    {item.quantity <= item.threshold && (
                      <button
                        type="button"
                        className="inventory-action-btn warning"
                        onClick={() => requestSupply(item.name)}
                      >
                        <AlertCircle size={14} />
                        Заказать
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
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
              <div className="stat-value">{nurseShiftStatsLoading ? '—' : nurseShiftStats.proceduresCompleted}</div>
              <div className="stat-label">Процедур выполнено</div>
            </div>
          </div>
          <div className="nurse-stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{nurseShiftStatsLoading ? '—' : nurseShiftStats.patientsServed}</div>
              <div className="stat-label">Пациентов обслужено</div>
            </div>
          </div>
          <div className="nurse-stat-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {nurseShiftStatsLoading
                  ? '—'
                  : nurseShiftStats.workingTimeMinutes === 0
                    ? '0м'
                    : `${Math.floor(nurseShiftStats.workingTimeMinutes / 60)}ч ${nurseShiftStats.workingTimeMinutes % 60}м`}
              </div>
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
            <button type="button" className="document-action-btn" onClick={downloadShiftReport}>
              <Printer size={16} />
              Сменный отчет
            </button>
            <button type="button" className="document-action-btn" onClick={downloadShiftJournal}>
              <Download size={16} />
              Скачать журнал
            </button>
          </div>
        </div>
      </div>

      {nurseNoteModal && (
        <div className="patient-modal-overlay active">
          <div className="patient-modal" style={{ maxWidth: 480 }}>
            <div className="patient-modal-header">
              <h3 className="patient-modal-title">Заметка к задаче</h3>
              <button type="button" className="patient-modal-close" onClick={() => setNurseNoteModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="patient-modal-note-content">
              <textarea
                className="prescription-textarea"
                rows={4}
                value={nurseNoteModal.currentNote}
                onChange={(e) => setNurseNoteModal((m) => (m ? { ...m, currentNote: e.target.value } : m))}
                placeholder="Введите заметку…"
              />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="add-button" disabled={nurseNoteSaving} onClick={saveTaskNote}>
                  {nurseNoteSaving ? 'Сохранение…' : 'Сохранить'}
                </button>
                <button type="button" className="finance-card-btn secondary" onClick={() => setNurseNoteModal(null)}>
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {nurseNewTaskModal && (
        <NurseNewTaskModal
          onClose={() => setNurseNewTaskModal(false)}
          onSuccess={() => {
            setNurseNewTaskModal(false);
            const today = new Date().toISOString().split('T')[0];
            AuthAPI.getMyTasks(nurseTasksPage, nurseTasksPageSize, nurseTasksFilter, today).then((res) => {
              setNurseTasks({ list: res?.list ?? [], total: res?.total ?? 0, pageSize: res?.pageSize ?? nurseTasksPageSize });
            });
          }}
          openInfo={openInfo}
        />
      )}

      {inventoryAddModal && (
        <InventoryAddModal
          onClose={() => setInventoryAddModal(false)}
          onSuccess={() => {
            setInventoryAddModal(false);
            fetchInventory();
          }}
          openInfo={openInfo}
        />
      )}
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
            <div className="admin-stat-value">
              {statsLoading ? '—' : systemStats.totalUsers}
            </div>
            <div className="admin-stat-trend positive">
              +{systemStats.usersThisMonth} за месяц
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <Calendar size={20} />
              <span>Записи сегодня</span>
            </div>
            <div className="admin-stat-value">
              {statsLoading ? '—' : systemStats.appointmentsToday}
            </div>
            <div className="admin-stat-trend">Запланировано</div>
          </div>
          <div className="admin-stat-card revenue">
            <div className="admin-stat-header">
              <CreditCard size={20} />
              <span>Выручка сегодня</span>
            </div>
            <div className="admin-stat-value">
              {statsLoading ? '—' : Number(systemStats.revenueToday).toLocaleString()} ₽
            </div>
            <div className="admin-stat-trend positive">
              +{systemStats.revenueGrowthPercent}% к прошлой неделе
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <Server size={20} />
              <span>Нагрузка системы</span>
            </div>
            <div className="admin-stat-value">{systemStats.systemLoad}%</div>
            <div className="admin-stat-trend neutral">{systemStats.systemLoadLabel}</div>
          </div>
        </div>
      </div>

      <div className="profile-content-block">
        <div className="profile-section-header">
          <h3 className="profile-section-title">
            <Shield size={18} />
            Запросы на утверждение
          </h3>
          <button
            className="profile-section-action"
            onClick={() => setPendingPage(1)}
          >
            Показать все
          </button>
        </div>

        {pendingLoading && pendingRequests.list.length === 0 ? (
          <div className="requests-panel">Загрузка...</div>
        ) : (
          <>
            <div className="requests-panel">
              {pendingRequests.list.map((user) => (
                <div key={user.id} className="request-card">
                  <div className="request-header">
                    <div className="request-type">Регистрация</div>
                    <div className="request-date">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })
                        : '—'}
                    </div>
                  </div>
                  <div className="request-info">
                    <div className="request-user">{user.fullName || 'Без имени'}</div>
                    {user.email && <div className="request-email">{user.email}</div>}
                  </div>
                  <div className="request-actions">
                    <button
                      className="request-action-btn approve"
                      disabled={pendingActionId === user.id}
                      onClick={() => approveRequest(user.id)}
                    >
                      <CheckCircle size={14} />
                      Утвердить
                    </button>
                    <button
                      className="request-action-btn reject"
                      disabled={pendingActionId === user.id}
                      onClick={() => rejectRequest(user.id)}
                    >
                      <X size={14} />
                      Отклонить
                    </button>
                    <button className="request-action-btn" type="button">
                      <MessageSquare size={14} />
                      Обсудить
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {pendingRequests.total > pendingRequests.pageSize && (
              <div className="profile-pagination">
                <span className="profile-pagination-info">
                  Страница {pendingRequests.page} из{' '}
                  {Math.ceil(pendingRequests.total / pendingRequests.pageSize) || 1}
                </span>
                <div className="profile-pagination-buttons">
                  <button
                    type="button"
                    className="profile-pagination-btn"
                    disabled={pendingRequests.page <= 1 || pendingLoading}
                    onClick={() => setPendingPage((p) => Math.max(1, p - 1))}
                  >
                    Назад
                  </button>
                  <button
                    type="button"
                    className="profile-pagination-btn"
                    disabled={
                      pendingRequests.page >=
                        Math.ceil(pendingRequests.total / pendingRequests.pageSize) ||
                      pendingLoading
                    }
                    onClick={() => setPendingPage((p) => p + 1)}
                  >
                    Вперёд
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="profile-content-block">
        <div className="profile-section-header">
          <h3 className="profile-section-title">
            <Settings size={18} />
            Управление системой
          </h3>
          <div className="admin-actions">
            <button
              className="admin-action-btn"
              onClick={backupSystem}
              disabled={!!adminActionLoading}
            >
              <Database size={16} />
              {adminActionLoading === 'backup' ? 'Запуск...' : 'Резервная копия'}
            </button>
            <button
              className="admin-action-btn"
              onClick={clearCache}
              disabled={!!adminActionLoading}
            >
              <Zap size={16} />
              {adminActionLoading === 'cache' ? 'Очистка...' : 'Очистка кэша'}
            </button>
          </div>
        </div>
        
        <div className="system-controls">
          <div className="control-group">
            <h4>Безопасность</h4>
            <div className="control-actions">
              <button
                className="control-btn"
                onClick={checkSecurity}
                disabled={!!adminActionLoading}
              >
                <ShieldCheck size={14} />
                {adminActionLoading === 'security' ? 'Проверка...' : 'Проверить безопасность'}
              </button>
              <button className="control-btn" onClick={openResetPasswordsModal}>
                <Key size={14} />
                Сбросить пароли
              </button>
            </div>
          </div>
          
          <div className="control-group">
            <h4>Отчетность</h4>
            <div className="control-actions">
              <button
                className="control-btn"
                onClick={() => generateReport('financial')}
                disabled={!!adminActionLoading}
              >
                <CreditCard size={14} />
                {adminActionLoading === 'report-financial' ? 'Формирование...' : 'Финансовый отчет'}
              </button>
              <button
                className="control-btn"
                onClick={() => generateReport('medical')}
                disabled={!!adminActionLoading}
              >
                <FileText size={14} />
                {adminActionLoading === 'report-medical' ? 'Формирование...' : 'Медицинский отчет'}
              </button>
              <button
                className="control-btn"
                onClick={() => generateReport('users')}
                disabled={!!adminActionLoading}
              >
                <Users size={14} />
                {adminActionLoading === 'report-users' ? 'Формирование...' : 'Отчет по пользователям'}
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
          {activityLoading && recentActivity.length === 0 ? (
            <div className="activity-placeholder">Загрузка...</div>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-action">{activity.action}</div>
                <div className="activity-meta">
                  <span className="activity-user">{activity.user}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))
          )}
          {activityTotal > 0 && (
            <div className="activity-pagination">
              <span className="activity-pagination-info">
                {((activityPage - 1) * activityPageSize) + 1}–{Math.min(activityPage * activityPageSize, activityTotal)} из {activityTotal}
              </span>
              <div className="activity-pagination-buttons">
                <button
                  type="button"
                  className="activity-pagination-btn"
                  disabled={activityLoading || activityPage <= 1}
                  onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
                >
                  Назад
                </button>
                <span className="activity-pagination-page">
                  Страница {activityPage} из {Math.max(1, Math.ceil(activityTotal / activityPageSize))}
                </span>
                <button
                  type="button"
                  className="activity-pagination-btn"
                  disabled={activityLoading || activityPage >= Math.ceil(activityTotal / activityPageSize)}
                  onClick={() => setActivityPage((p) => p + 1)}
                >
                  Вперёд
                </button>
              </div>
            </div>
          )}
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
                  <div className="summary-value">
                    {currentUser?.type === 'doctor' ? doctorPatientsTotal : filteredPatients.length}
                  </div>
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
              {currentUser?.type === 'doctor' && doctorPatientsLoading && filteredPatients.length === 0 ? (
                <div className="doctor-patients-loading">Загрузка пациентов...</div>
              ) : filteredPatients.length > 0 ? (
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
              {currentUser?.type === 'doctor' && doctorPatientsTotal > 0 && (
                <div className="doctor-patients-pagination">
                  <span className="doctor-patients-pagination-info">
                    {((doctorPatientsPage - 1) * doctorPatientsPageSize) + 1}–{Math.min(doctorPatientsPage * doctorPatientsPageSize, doctorPatientsTotal)} из {doctorPatientsTotal}
                  </span>
                  <div className="doctor-patients-pagination-buttons">
                    <button
                      type="button"
                      className="doctor-patients-pagination-btn"
                      disabled={doctorPatientsLoading || doctorPatientsPage <= 1}
                      onClick={() => setDoctorPatientsPage((p) => Math.max(1, p - 1))}
                    >
                      Назад
                    </button>
                    <span className="doctor-patients-pagination-page">
                      Страница {doctorPatientsPage} из {Math.max(1, Math.ceil(doctorPatientsTotal / doctorPatientsPageSize))}
                    </span>
                    <button
                      type="button"
                      className="doctor-patients-pagination-btn"
                      disabled={doctorPatientsLoading || doctorPatientsPage >= Math.ceil(doctorPatientsTotal / doctorPatientsPageSize)}
                      onClick={() => setDoctorPatientsPage((p) => p + 1)}
                    >
                      Вперёд
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-content-block">
          <h3 className="profile-section-title">
            <FileText size={18} />
            Запросы на продление рецептов
          </h3>
          {doctorRenewalRequestsLoading ? (
            <div className="profile-loading-msg">Загрузка запросов…</div>
          ) : doctorRenewalRequests.length === 0 ? (
            <div className="profile-empty-msg">Нет запросов на продление.</div>
          ) : (
            <div className="renewal-requests-list">
              {doctorRenewalRequests.map((req) => {
                const prescription = req.prescription ?? {};
                const patientUser = req.patientUser ?? {};
                const patientName = patientUser.fullName || 'Пациент';
                const isPending = req.status === 'pending';
                const isUpdating = renewalRequestUpdatingId === req.id;
                return (
                  <div key={req.id} className={`renewal-request-card renewal-request-${req.status}`}>
                    <div className="renewal-request-info">
                      <div className="renewal-request-patient">{patientName}</div>
                      <div className="renewal-request-prescription">
                        {prescription.prescriptionName || 'Назначение'} {prescription.prescriptionDosage ? `— ${prescription.prescriptionDosage}` : ''}
                      </div>
                      <div className="renewal-request-status">
                        {req.status === 'pending' && 'Ожидает решения'}
                        {req.status === 'approved' && 'Одобрен'}
                        {req.status === 'rejected' && 'Отклонён'}
                      </div>
                    </div>
                    {isPending && (
                      <div className="renewal-request-actions">
                        <button
                          type="button"
                          className="renewal-request-btn approve"
                          disabled={isUpdating}
                          onClick={async () => {
                            setRenewalRequestUpdatingId(req.id);
                            try {
                              await AuthAPI.updateRenewalRequestStatus(req.id, 'approved');
                              openInfo({ title: 'Готово', message: 'Запрос одобрен.', variant: 'success' });
                              const res = await AuthAPI.getMyRenewalRequests();
                              setDoctorRenewalRequests(res?.list ?? []);
                            } catch (e) {
                              openInfo({ title: 'Ошибка', message: e?.response?.data?.message || 'Не удалось одобрить.', variant: 'error' });
                            } finally {
                              setRenewalRequestUpdatingId(null);
                            }
                          }}
                        >
                          Одобрить
                        </button>
                        <button
                          type="button"
                          className="renewal-request-btn reject"
                          disabled={isUpdating}
                          onClick={async () => {
                            setRenewalRequestUpdatingId(req.id);
                            try {
                              await AuthAPI.updateRenewalRequestStatus(req.id, 'rejected');
                              openInfo({ title: 'Готово', message: 'Запрос отклонён.', variant: 'success' });
                              const res = await AuthAPI.getMyRenewalRequests();
                              setDoctorRenewalRequests(res?.list ?? []);
                            } catch (e) {
                              openInfo({ title: 'Ошибка', message: e?.response?.data?.message || 'Не удалось отклонить.', variant: 'error' });
                            } finally {
                              setRenewalRequestUpdatingId(null);
                            }
                          }}
                        >
                          Отклонить
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="profile-content-block">
          <h3 className="profile-section-title">
            <Calendar size={18} />
            Расписание на сегодня
          </h3>
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-value">{doctorPatientsTotal}</div>
              <div className="profile-stat-label">Всего пациентов</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{todayVisitsTotal}</div>
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
            {todayVisitsLoading && todayVisitsList.length === 0 ? (
              <div className="profile-loading-msg">Загрузка приёмов…</div>
            ) : todayVisitsList.length === 0 ? (
              <div className="profile-empty-msg">На сегодня приёмов нет.</div>
            ) : (
              <>
                {todayVisitsList
                  .filter(v => v.appointmentStatus !== 'cancelled')
                  .map(v => (
                    <div key={v.visitId} className="profile-appointment">
                      <div className="appointment-date">
                        <div className="appointment-day">{new Date().getDate()}</div>
                        <div className="appointment-month">
                          {new Date().toLocaleString('ru-RU', { month: 'short' })}
                        </div>
                      </div>
                      <div className="appointment-info">
                        <div className="appointment-time-doctor">
                          <span className="appointment-patient">{v.fullName}</span>
                          <span className="appointment-time">{v.time}</span>
                        </div>
                        <div className="appointment-specialty">{v.phone}</div>
                        <button
                          className="appointment-action-btn"
                          onClick={() => {
                            const p = doctorPatientsList.find(pat => pat.id === v.cardId) ?? {
                              id: v.cardId,
                              fullName: v.fullName,
                              phone: v.phone,
                              firstName: (v.fullName || '').split(/\s+/)[0] || '',
                              lastName: (v.fullName || '').split(/\s+/).slice(1).join(' ') || '',
                            };
                            openPatientCard(p);
                          }}
                        >
                          Открыть карточку
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                <div className="profile-pagination-inline">
                  <span>
                    {((todayVisitsPage - 1) * todayVisitsPageSize) + 1}–
                    {Math.min(todayVisitsPage * todayVisitsPageSize, todayVisitsTotal)} из {todayVisitsTotal}
                  </span>
                  <button
                    type="button"
                    className="profile-pagination-btn"
                    disabled={todayVisitsLoading || todayVisitsPage <= 1}
                    onClick={() => setTodayVisitsPage((p) => Math.max(1, p - 1))}
                  >
                    Назад
                  </button>
                  <span>Стр. {todayVisitsPage} из {Math.max(1, Math.ceil(todayVisitsTotal / todayVisitsPageSize))}</span>
                  <button
                    type="button"
                    className="profile-pagination-btn"
                    disabled={todayVisitsLoading || todayVisitsPage >= Math.ceil(todayVisitsTotal / todayVisitsPageSize)}
                    onClick={() => setTodayVisitsPage((p) => p + 1)}
                  >
                    Вперёд
                  </button>
                </div>
              </>
            )}
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
                setModalPatientPage(1);
                setModalPatientSearch('');
                setSelectedPatientForAction(null);
                setQuickActionType('prescription');
              }}
            >
              <ClipboardList size={20} />
              Добавить назначение
            </button>
            <button
              className="quick-action-btn"
              onClick={() => {
                setModalPatientPage(1);
                setModalPatientSearch('');
                setSelectedPatientForAction(null);
                setQuickActionType('analysis');
              }}
            >
              <FileText size={20} />
              Добавить анализы
            </button>
            <button
              className="quick-action-btn"
              onClick={() => {
                setCancelVisitsPage(1);
                setQuickActionType('cancel');
              }}
            >
              <CheckCircle size={20} />
              Отменить посещение
            </button>
          </div>
        </div>
      </>
    );
  };

  const effectiveUserType = currentUser.type === 'admin' || currentUser?.isAdmin ? 'admin' : currentUser.type;

  // Выбор панели в зависимости от типа пользователя (учитываем type и isAdmin для админа)
  const renderUserPanel = () => {
    switch (effectiveUserType) {
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
              {effectiveUserType === 'patient'
                ? 'Управляйте вашими записями, историей болезни и персональными данными'
                : effectiveUserType === 'doctor'
                ? 'Ваше рабочее пространство для ведения пациентов и расписания'
                : effectiveUserType === 'nurse'
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
                    <div className="profile-avatar" style={{background: getUserTypeColor(effectiveUserType)}}>
                      {getUserTypeIcon(effectiveUserType)}
                    </div>
                    <div className="profile-name-role">
                      <h2>{currentUser.firstName} {currentUser.lastName}</h2>
                      <div className="profile-role">
                        <span className="profile-role-badge" style={{background: getUserTypeColor(effectiveUserType)}}>
                          {getUserTypeLabel(effectiveUserType)}
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

                      {currentUser.type === 'doctor' && (
                        <div className="profile-input-group">
                          <label className="profile-label">Сертификат / Лицензия</label>
                          {isEditing ? (
                            <div className="profile-input-wrapper">
                              <Shield size={18} className="profile-input-icon" />
                              <input
                                type="text"
                                value={userData.certificate ?? ''}
                                onChange={(e) => handleInputChange('certificate', e.target.value)}
                                className="profile-input"
                                placeholder="Номер или название сертификата"
                              />
                            </div>
                          ) : (
                            <div className="profile-info-value">
                              <Shield size={16} className="profile-info-icon" />
                              {currentUser.license || currentUser.certificates?.[0] || '—'}
                            </div>
                          )}
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
                      {(currentUser.type === 'admin' || currentUser?.isAdmin) && (
                        <button
                          type="button"
                          className="profile-security-button"
                          onClick={() => navigate('/profile/security')}
                        >
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

      {/* Модальное окно сброса паролей врачей */}
      <div className={`password-modal-overlay ${isResetPasswordsModalOpen ? 'active' : ''}`} onClick={closeResetPasswordsModal} aria-hidden={!isResetPasswordsModalOpen}>
        <div className="password-modal" onClick={(e) => e.stopPropagation()}>
          <div className="password-modal-header">
            <div className="password-modal-title-wrap">
              <Key size={22} className="password-modal-icon" />
              <h3 className="password-modal-title">Сброс паролей врачей</h3>
            </div>
            <p className="password-modal-subtitle">Введите новый пароль — он будет установлен для всех врачей в системе (не менее 6 символов)</p>
            <button type="button" className="password-modal-close" onClick={closeResetPasswordsModal} aria-label="Закрыть">
              <X size={20} />
            </button>
          </div>
          <form className="password-modal-form" onSubmit={handleResetDoctorsPassword}>
            {resetPasswordsError && <div className="password-modal-error">{resetPasswordsError}</div>}
            {resetPasswordsSuccess && <div className="password-modal-success">{resetPasswordsSuccess}</div>}
            <div className="password-modal-field">
              <label className="password-modal-label">Новый пароль</label>
              <div className="password-modal-input-wrap">
                <Lock size={18} className="password-modal-input-icon" />
                <input
                  type={showResetNew ? 'text' : 'password'}
                  value={resetPasswordsNew}
                  onChange={(e) => setResetPasswordsNew(e.target.value)}
                  className="password-modal-input"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={6}
                  disabled={resetPasswordsSaving}
                />
                <button type="button" className="password-modal-toggle" onClick={() => setShowResetNew((v) => !v)} aria-label={showResetNew ? 'Скрыть пароль' : 'Показать пароль'}>
                  {showResetNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="password-modal-field">
              <label className="password-modal-label">Подтвердите пароль</label>
              <div className="password-modal-input-wrap">
                <Lock size={18} className="password-modal-input-icon" />
                <input
                  type={showResetConfirm ? 'text' : 'password'}
                  value={resetPasswordsConfirm}
                  onChange={(e) => setResetPasswordsConfirm(e.target.value)}
                  className="password-modal-input"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={6}
                  disabled={resetPasswordsSaving}
                />
                <button type="button" className="password-modal-toggle" onClick={() => setShowResetConfirm((v) => !v)} aria-label={showResetConfirm ? 'Скрыть пароль' : 'Показать пароль'}>
                  {showResetConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="password-modal-actions">
              <button type="button" className="password-modal-btn password-modal-btn-cancel" onClick={closeResetPasswordsModal} disabled={resetPasswordsSaving}>
                Отмена
              </button>
              <button type="submit" className="password-modal-btn password-modal-btn-submit" disabled={resetPasswordsSaving}>
                {resetPasswordsSaving ? 'Сохранение...' : 'Установить пароль всем врачам'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Модалки быстрых действий врача: выбор пациента / визита, формы назначения и анализов */}
      {currentUser?.type === 'doctor' && (
        <div
          className={`quick-action-modal-overlay ${quickActionType ? 'active' : ''}`}
          onClick={() => {
            setQuickActionType(null);
            setSelectedPatientForAction(null);
          }}
          aria-hidden={!quickActionType}
        >
          <div className="quick-action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="quick-action-modal-header">
              <h3 className="quick-action-modal-title">
                {quickActionType === 'prescription' && !selectedPatientForAction && 'Добавить назначение — выберите пациента'}
                {quickActionType === 'prescription' && selectedPatientForAction && `Назначение: ${selectedPatientForAction.fullName}`}
                {quickActionType === 'analysis' && !selectedPatientForAction && 'Добавить анализы — выберите пациента'}
                {quickActionType === 'analysis' && selectedPatientForAction && `Анализы: ${selectedPatientForAction.fullName}`}
                {quickActionType === 'cancel' && 'Отменить посещение'}
              </h3>
              <button
                type="button"
                className="quick-action-modal-close"
                onClick={() => { setQuickActionType(null); setSelectedPatientForAction(null); }}
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>
            </div>
            <div className="quick-action-modal-body">
              {/* Шаг 1: выбор пациента (назначение / анализы) */}
              {(quickActionType === 'prescription' || quickActionType === 'analysis') && !selectedPatientForAction && (
                <>
                  <div className="quick-action-search">
                    <Search size={18} />
                    <input
                      type="text"
                      className="quick-action-search-input"
                      placeholder="Поиск по имени пациента"
                      value={modalPatientSearch}
                      onChange={(e) => { setModalPatientSearch(e.target.value); setModalPatientPage(1); }}
                    />
                  </div>
                  {modalPatientLoading ? (
                    <div className="quick-action-loading">Загрузка…</div>
                  ) : (
                    <div className="quick-action-table-wrap">
                      <table className="quick-action-table">
                        <thead>
                          <tr>
                            <th>ФИО</th>
                            <th>Телефон</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {modalPatientList.map((item) => (
                            <tr key={item.id}>
                              <td>{item.fullName || '—'}</td>
                              <td>{item.phone || '—'}</td>
                              <td>
                                <button
                                  type="button"
                                  className="quick-action-select-btn"
                                  onClick={() => setSelectedPatientForAction({ id: item.id, fullName: item.fullName, phone: item.phone })}
                                >
                                  Выбрать
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {modalPatientList.length === 0 && <div className="quick-action-empty">Пациенты не найдены</div>}
                      <div className="quick-action-pagination">
                        <span>
                          {((modalPatientPage - 1) * modalPatientPageSize) + 1}–{Math.min(modalPatientPage * modalPatientPageSize, modalPatientTotal)} из {modalPatientTotal}
                        </span>
                        <button
                          type="button"
                          className="profile-pagination-btn"
                          disabled={modalPatientLoading || modalPatientPage <= 1}
                          onClick={() => setModalPatientPage((p) => Math.max(1, p - 1))}
                        >
                          Назад
                        </button>
                        <span>Стр. {modalPatientPage} из {Math.max(1, Math.ceil(modalPatientTotal / modalPatientPageSize))}</span>
                        <button
                          type="button"
                          className="profile-pagination-btn"
                          disabled={modalPatientLoading || modalPatientPage >= Math.ceil(modalPatientTotal / modalPatientPageSize)}
                          onClick={() => setModalPatientPage((p) => p + 1)}
                        >
                          Вперёд
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Шаг 2: форма назначения */}
              {quickActionType === 'prescription' && selectedPatientForAction && (
                <form
                  className="quick-action-form"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setQuickActionSubmitting(true);
                    try {
                      await AuthAPI.createPrescription({
                        pacientId: selectedPatientForAction.id,
                        prescriptionName: prescriptionForm.prescriptionName,
                        prescriptionDosage: prescriptionForm.prescriptionDosage,
                        prescriptionFrequency: prescriptionForm.prescriptionFrequency,
                        prescriptionTime: prescriptionForm.prescriptionTime,
                        description: prescriptionForm.description,
                      });
                      openInfo({ title: 'Готово', message: 'Назначение добавлено.', variant: 'success' });
                      setQuickActionType(null);
                      setSelectedPatientForAction(null);
                      setPrescriptionForm({ prescriptionName: '', prescriptionDosage: '', prescriptionFrequency: '', prescriptionTime: '', description: '' });
                    } catch (err) {
                      openInfo({ title: 'Ошибка', message: err?.response?.data?.message || 'Не удалось добавить назначение', variant: 'error' });
                    } finally {
                      setQuickActionSubmitting(false);
                    }
                  }}
                >
                  <div className="quick-action-form-row">
                    <label>Название препарата</label>
                    <input value={prescriptionForm.prescriptionName} onChange={(e) => setPrescriptionForm((f) => ({ ...f, prescriptionName: e.target.value }))} required />
                  </div>
                  <div className="quick-action-form-row">
                    <label>Дозировка</label>
                    <input value={prescriptionForm.prescriptionDosage} onChange={(e) => setPrescriptionForm((f) => ({ ...f, prescriptionDosage: e.target.value }))} required />
                  </div>
                  <div className="quick-action-form-row">
                    <label>Частота приёма</label>
                    <input value={prescriptionForm.prescriptionFrequency} onChange={(e) => setPrescriptionForm((f) => ({ ...f, prescriptionFrequency: e.target.value }))} required />
                  </div>
                  <div className="quick-action-form-row">
                    <label>Время приёма</label>
                    <input value={prescriptionForm.prescriptionTime} onChange={(e) => setPrescriptionForm((f) => ({ ...f, prescriptionTime: e.target.value }))} required />
                  </div>
                  <div className="quick-action-form-row">
                    <label>Описание</label>
                    <textarea value={prescriptionForm.description} onChange={(e) => setPrescriptionForm((f) => ({ ...f, description: e.target.value }))} required />
                  </div>
                  <div className="quick-action-form-actions">
                    <button type="button" className="quick-action-btn-cancel" onClick={() => setSelectedPatientForAction(null)}>Назад</button>
                    <button type="submit" className="quick-action-btn-submit" disabled={quickActionSubmitting}>{quickActionSubmitting ? 'Сохранение…' : 'Сохранить'}</button>
                  </div>
                </form>
              )}

              {/* Шаг 2: форма анализа */}
              {quickActionType === 'analysis' && selectedPatientForAction && (
                <form
                  className="quick-action-form"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setQuickActionSubmitting(true);
                    try {
                      await AuthAPI.createAnalysis({
                        pacientId: selectedPatientForAction.id,
                        type: analysisForm.type,
                        text: analysisForm.text || undefined,
                        assignedDate: analysisForm.assignedDate,
                        costs: analysisForm.costs ? Number(analysisForm.costs) : undefined,
                      });
                      openInfo({ title: 'Готово', message: 'Анализ добавлен.', variant: 'success' });
                      setQuickActionType(null);
                      setSelectedPatientForAction(null);
                      setAnalysisForm({ type: '', text: '', assignedDate: new Date().toISOString().split('T')[0], costs: '' });
                    } catch (err) {
                      openInfo({ title: 'Ошибка', message: err?.response?.data?.message || 'Не удалось добавить анализ', variant: 'error' });
                    } finally {
                      setQuickActionSubmitting(false);
                    }
                  }}
                >
                  <div className="quick-action-form-row">
                    <label>Тип анализа</label>
                    <input value={analysisForm.type} onChange={(e) => setAnalysisForm((f) => ({ ...f, type: e.target.value }))} required placeholder="Например: ОАК" />
                  </div>
                  <div className="quick-action-form-row">
                    <label>Дата назначения</label>
                    <input type="date" value={analysisForm.assignedDate} onChange={(e) => setAnalysisForm((f) => ({ ...f, assignedDate: e.target.value }))} required />
                  </div>
                  <div className="quick-action-form-row">
                    <label>Примечание (необязательно)</label>
                    <textarea value={analysisForm.text} onChange={(e) => setAnalysisForm((f) => ({ ...f, text: e.target.value }))} />
                  </div>
                  <div className="quick-action-form-row">
                    <label>Стоимость (необязательно)</label>
                    <input type="number" value={analysisForm.costs} onChange={(e) => setAnalysisForm((f) => ({ ...f, costs: e.target.value }))} placeholder="100" />
                  </div>
                  <div className="quick-action-form-actions">
                    <button type="button" className="quick-action-btn-cancel" onClick={() => setSelectedPatientForAction(null)}>Назад</button>
                    <button type="submit" className="quick-action-btn-submit" disabled={quickActionSubmitting}>{quickActionSubmitting ? 'Сохранение…' : 'Сохранить'}</button>
                  </div>
                </form>
              )}

              {/* Модалка отмены посещения: список визитов на сегодня */}
              {quickActionType === 'cancel' && (
                <>
                  {cancelVisitsLoading ? (
                    <div className="quick-action-loading">Загрузка визитов…</div>
                  ) : (
                    <div className="quick-action-table-wrap">
                      <table className="quick-action-table">
                        <thead>
                          <tr>
                            <th>Пациент</th>
                            <th>Время</th>
                            <th>Статус</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {cancelVisitsList
                            .filter((v) => v.appointmentStatus !== 'cancelled')
                            .map((v) => (
                              <tr key={v.visitId}>
                                <td>{v.fullName}</td>
                                <td>{v.time}</td>
                                <td>{v.appointmentStatus === 'confirmed' ? 'Подтверждён' : v.appointmentStatus === 'pending' ? 'Ожидает' : v.appointmentStatus}</td>
                                <td>
                                  <button
                                    type="button"
                                    className="quick-action-cancel-visit-btn"
                                    disabled={quickActionSubmitting}
                                    onClick={async () => {
                                      setQuickActionSubmitting(true);
                                      try {
                                        await AuthAPI.cancelVisit(v.visitId);
                                        openInfo({ title: 'Готово', message: 'Визит отменён.', variant: 'success' });
                                        setCancelVisitsList((prev) => prev.filter((x) => x.visitId !== v.visitId));
                                        setCancelVisitsTotal((t) => Math.max(0, t - 1));
                                        AuthAPI.getMyVisitsToday(todayVisitsPage, todayVisitsPageSize).then((res) => {
                                          setTodayVisitsList(res?.list ?? []);
                                          setTodayVisitsTotal(res?.total ?? 0);
                                        });
                                      } catch (err) {
                                        openInfo({ title: 'Ошибка', message: err?.response?.data?.message || 'Не удалось отменить визит', variant: 'error' });
                                      } finally {
                                        setQuickActionSubmitting(false);
                                      }
                                    }}
                                  >
                                    Отменить визит
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      {cancelVisitsList.filter((v) => v.appointmentStatus !== 'cancelled').length === 0 && (
                        <div className="quick-action-empty">Нет визитов для отмены на сегодня.</div>
                      )}
                      <div className="quick-action-pagination">
                        <span>{((cancelVisitsPage - 1) * cancelVisitsPageSize) + 1}–{Math.min(cancelVisitsPage * cancelVisitsPageSize, cancelVisitsTotal)} из {cancelVisitsTotal}</span>
                        <button
                          type="button"
                          className="profile-pagination-btn"
                          disabled={cancelVisitsLoading || cancelVisitsPage <= 1}
                          onClick={() => setCancelVisitsPage((p) => Math.max(1, p - 1))}
                        >
                          Назад
                        </button>
                        <span>Стр. {cancelVisitsPage} из {Math.max(1, Math.ceil(cancelVisitsTotal / cancelVisitsPageSize))}</span>
                        <button
                          type="button"
                          className="profile-pagination-btn"
                          disabled={cancelVisitsLoading || cancelVisitsPage >= Math.ceil(cancelVisitsTotal / cancelVisitsPageSize)}
                          onClick={() => setCancelVisitsPage((p) => p + 1)}
                        >
                          Вперёд
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {patientCardModalContent}
    </div>
  );
};

export default ProfilePage;