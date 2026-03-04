import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useInfoModal } from '../../context/InfoModalContext';
import { AdminAPI } from '../../api/admin';
import './SecuritySettingsPage.css';

const USER_TYPE_LABELS = {
  pacient: 'Пациент',
  admin: 'Администратор',
  doctor: 'Врач',
  nurse: 'Медсестра',
};

const SecuritySettingsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { openInfo } = useInfoModal();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const pageSize = 10;

  const isAdmin = currentUser?.isAdmin === true || currentUser?.type === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/profile', { replace: true });
      return;
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    setLoading(true);
    AdminAPI.getUsersPage(page, pageSize)
      .then((res) => {
        if (!cancelled) {
          setUsers(res?.list ?? []);
          setTotal(res?.total ?? 0);
        }
      })
      .catch(() => {
        if (!cancelled) openInfo({ title: 'Ошибка', message: 'Не удалось загрузить список пользователей', variant: 'error' });
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isAdmin, page, pageSize]);

  const handleAdminChange = (user, checked) => {
    if (updatingId) return;
    setUpdatingId(user.id);
    AdminAPI.updateUserRole(user.id, { isAdmin: checked })
      .then(() => {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isAdmin: checked } : u)));
      })
      .catch(() => {
        openInfo({ title: 'Ошибка', message: 'Не удалось обновить права', variant: 'error' });
      })
      .finally(() => setUpdatingId(null));
  };

  const handleTypeChange = (user, newType) => {
    if (updatingId) return;
    if (newType === user.userType) return;
    setUpdatingId(user.id);
    AdminAPI.updateUserRole(user.id, { userType: newType })
      .then(() => {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, userType: newType } : u)));
      })
      .catch(() => {
        openInfo({ title: 'Ошибка', message: 'Не удалось изменить тип пользователя', variant: 'error' });
      })
      .finally(() => setUpdatingId(null));
  };

  if (!currentUser) return null;
  if (!isAdmin) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="security-settings-page">
      <div className="security-settings-container">
        <header className="security-settings-header">
          <button type="button" className="security-settings-back" onClick={() => navigate('/profile')}>
            <ChevronLeft size={20} />
            Назад к профилю
          </button>
          <h1 className="security-settings-title">
            <Shield size={28} />
            Настройки безопасности
          </h1>
          <p className="security-settings-desc">
            Управление правами и типами пользователей. Отметьте «Администратор», чтобы выдать права администратора, или снимите галочку, чтобы снять.
          </p>
        </header>

        <div className="security-settings-table-wrap">
          {loading && users.length === 0 ? (
            <div className="security-settings-loading">
              <Loader2 size={32} className="spin" />
              Загрузка...
            </div>
          ) : (
            <table className="security-settings-table">
              <thead>
                <tr>
                  <th>ФИО</th>
                  <th>Email</th>
                  <th>Тип пользователя</th>
                  <th>Администратор</th>
                  <th>Подтверждён</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="security-settings-cell-name">{user.fullName || '—'}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        className="security-settings-select"
                        value={user.userType}
                        disabled={!!updatingId}
                        onChange={(e) => handleTypeChange(user, e.target.value)}
                      >
                        {Object.entries(USER_TYPE_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <label className="security-settings-checkbox-label">
                        <input
                          type="checkbox"
                          checked={!!user.isAdmin}
                          disabled={!!updatingId}
                          onChange={(e) => handleAdminChange(user, e.target.checked)}
                        />
                        {updatingId === user.id ? (
                          <Loader2 size={18} className="spin security-settings-cell-loader" />
                        ) : (
                          <span className="security-settings-checkbox-text">{user.isAdmin ? 'Да' : 'Нет'}</span>
                        )}
                      </label>
                    </td>
                    <td>
                      <span className={'security-settings-badge ' + (user.isConfirmed ? 'confirmed' : 'pending')}>
                        {user.isConfirmed ? 'Да' : 'Нет'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {total > 0 && (
          <div className="security-settings-pagination">
            <span className="security-settings-pagination-info">
              {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, total)} из {total}
            </span>
            <div className="security-settings-pagination-buttons">
              <button
                type="button"
                className="security-settings-pagination-btn"
                disabled={loading || page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Назад
              </button>
              <span className="security-settings-pagination-page">
                Страница {page} из {totalPages}
              </span>
              <button
                type="button"
                className="security-settings-pagination-btn"
                disabled={loading || page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Вперёд
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySettingsPage;
