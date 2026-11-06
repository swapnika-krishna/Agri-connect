import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Send,
  User as UserIcon,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { queryService } from '../../services/queryService';
import { Query, Reply } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Textarea } from '../../components/common/Textarea';

export const QueryDetailPage: React.FC = () => {
  const { queryId } = useParams<{ queryId: string }>();
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState<Query | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (queryId) {
      loadQuery(queryId);
    }
  }, [queryId]);

  const loadQuery = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await queryService.getQueryById(id);
      setQuery(data);
    } catch (err) {
      console.error('Failed to load query', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryId || !replyMessage.trim()) return;
    setIsSubmitting(true);
    setError('');
    try {
      await queryService.addReply(queryId, replyMessage);
      setReplyMessage('');
      await loadQuery(queryId);
    } catch (err: any) {
      setError(err.message || 'Failed to submit response');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async () => {
    if (!queryId) return;
    try {
      await queryService.resolveQuery(queryId);
      await loadQuery(queryId);
    } catch (err) {
      console.error('Failed to resolve query', err);
    }
  };

  if (!query && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Query thread not found.</p>
        <Link
          to={role === 'expert' ? '/expert/queries' : '/queries'}
          className="mt-4 inline-block text-emerald-700 font-semibold text-xs"
        >
          Return to Queries
        </Link>
      </div>
    );
  }

  const isResolved = query?.status === 'Resolved';
  const canReply = role === 'expert' || role === 'admin';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={query?.title || 'Advisory Query'}
        description={`Category: ${query?.category} · Posted by ${query?.farmer?.name || 'Farmer'}`}
        breadcrumbs={[
          { label: 'Dashboard', href: role === 'expert' ? '/expert' : '/dashboard' },
          {
            label: 'Queries',
            href: role === 'expert' ? '/expert/queries' : '/queries',
          },
          { label: 'Discussion Thread' },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate(role === 'expert' ? '/expert/queries' : '/queries')}
            >
              Back
            </Button>
            {!isResolved && (
              <Button
                size="sm"
                variant="outline"
                className="text-emerald-700 hover:bg-emerald-50"
                onClick={handleResolve}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Mark as Resolved
              </Button>
            )}
          </div>
        }
      />

      {/* Query Question Original Post */}
      {query && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                {query.farmer?.name ? query.farmer.name.charAt(0) : 'F'}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">
                  {query.farmer?.name || 'Farmer'}
                </span>
                <span className="text-xs text-slate-400">
                  {query.farmer?.district ? `${query.farmer.district}, ${query.farmer.state}` : 'Farmer'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={
                  query.status === 'Resolved'
                    ? 'success'
                    : query.status === 'Answered'
                    ? 'info'
                    : 'warning'
                }
                dot
              >
                {query.status}
              </Badge>
              <Badge variant="neutral">{query.category}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">{query.title}</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {query.description}
            </p>
          </div>

          <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Posted on {new Date(query.createdAt).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Expert Replies Timeline */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Specialist Recommendations ({query?.replies?.length || 0})
        </h3>

        {query?.replies && query.replies.length > 0 ? (
          <div className="space-y-4">
            {query.replies.map((reply, idx) => (
              <div
                key={reply._id || reply.id || idx}
                className="bg-white rounded-xl border border-emerald-100/80 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                      {reply.expert?.name ? reply.expert.name.charAt(0) : 'E'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">
                          {reply.expert?.name || 'Agricultural Specialist'}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Verified Agronomist · {new Date(reply.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line pl-10">
                  {reply.message}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
            Awaiting response from registered agronomy experts. You will receive a notification as soon as an agronomist reviews your case.
          </div>
        )}
      </div>

      {/* Expert Response Box (if expert or admin) */}
      {canReply && !isResolved && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Provide Agronomist Advisory Reply</span>
          </h4>

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          <form onSubmit={handleSendReply} className="space-y-3">
            <Textarea
              rows={4}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Provide exact diagnosis, chemical/organic treatment, dosage per litre of water, and spraying cautions..."
              required
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" isLoading={isSubmitting} rightIcon={<Send className="w-3.5 h-3.5" />}>
                Post Official Recommendation
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
