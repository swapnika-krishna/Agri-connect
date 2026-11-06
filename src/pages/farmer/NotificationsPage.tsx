import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  CloudSun,
  TrendingUp,
  Info,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'query_reply':
      case 'query_new':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'weather_alert':
        return <CloudSun className="w-4 h-4 text-sky-600" />;
      case 'market_alert':
        return <TrendingUp className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleNotificationClick = (notifId: string, link?: string) => {
    markAsRead(notifId);
    if (link) {
      navigate(link);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Notifications & Alerts"
        description="Agro-weather warnings, expert advisory responses, and APMC market price spikes."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Notifications' },
        ]}
        action={
          unreadCount > 0 ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => markAllAsRead()}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Mark All as Read
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-8 h-8" />}
          title="No notifications received"
          description="You will see real-time updates when agronomists reply to your queries, or when significant rainfall or price shifts occur."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
          {notifications.map((n) => (
            <div
              key={n._id || n.id}
              onClick={() => handleNotificationClick(n._id || n.id || '', n.link)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                n.isRead ? 'bg-white hover:bg-slate-50/50' : 'bg-emerald-50/40 hover:bg-emerald-50/70'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                  {getNotificationIcon(n.type)}
                </div>
                <div className="space-y-1">
                  <p className={`text-xs ${n.isRead ? 'text-slate-700' : 'text-slate-900 font-semibold'} leading-snug`}>
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(n.createdAt).toLocaleDateString()} at{' '}
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                )}
                {n.link && <ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
