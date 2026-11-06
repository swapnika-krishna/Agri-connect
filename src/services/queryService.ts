import { USE_MOCK } from './config';
import { api } from './api';
import { mockStorage } from './storage';
import { Query, QueryCategory, QueryStatus, Reply, Notification } from '../types';

export interface CreateQueryData {
  title: string;
  description: string;
  category: QueryCategory;
  farmId?: string;
}

export const queryService = {
  async getMyQueries(): Promise<Query[]> {
    if (!USE_MOCK) {
      return api.get('/queries/mine');
    }
    const user = mockStorage.getCurrentUser();
    if (!user) return [];
    const all = mockStorage.getQueries();
    return all.filter((q) => q.farmer._id === user._id || q.farmer.id === user._id);
  },

  async getAllQueries(filters?: { status?: string; category?: string }): Promise<Query[]> {
    if (!USE_MOCK) {
      const q = new URLSearchParams();
      if (filters?.status) q.set('status', filters.status);
      if (filters?.category) q.set('category', filters.category);
      return api.get(`/queries?${q.toString()}`);
    }

    let all = mockStorage.getQueries();
    if (filters?.status && filters.status !== 'All') {
      all = all.filter((q) => q.status === filters.status);
    }
    if (filters?.category && filters.category !== 'All') {
      all = all.filter((q) => q.category === filters.category);
    }
    return all;
  },

  async getQueryById(id: string): Promise<Query> {
    if (!USE_MOCK) {
      return api.get(`/queries/${id}`);
    }
    const q = mockStorage.getQueries().find((item) => item._id === id || item.id === id);
    if (!q) throw new Error('Query not found');
    return q;
  },

  async createQuery(data: CreateQueryData): Promise<Query> {
    if (!USE_MOCK) {
      return api.post('/queries', data);
    }
    const user = mockStorage.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const newQuery: Query = {
      _id: `query_${Date.now()}`,
      id: `query_${Date.now()}`,
      farmer: user,
      title: data.title,
      description: data.description,
      category: data.category,
      farmId: data.farmId,
      status: 'Open',
      replies: [],
      createdAt: new Date().toISOString(),
    };

    const queries = mockStorage.getQueries();
    queries.unshift(newQuery);
    mockStorage.setQueries(queries);

    // Notify experts
    const users = mockStorage.getUsers();
    const experts = users.filter((u) => u.role === 'expert' && u.isActive);
    const notifications = mockStorage.getNotifications();
    experts.forEach((exp) => {
      const notif: Notification = {
        _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        user: exp._id,
        message: `New Query Posted: "${data.title}" by ${user.name} in category ${data.category}.`,
        type: 'query_new',
        link: `/expert/queries/${newQuery._id}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      notifications.unshift(notif);
    });
    mockStorage.setNotifications(notifications);

    return newQuery;
  },

  async addReply(queryId: string, message: string): Promise<Reply> {
    if (!USE_MOCK) {
      return api.post(`/queries/${queryId}/replies`, { message });
    }
    const user = mockStorage.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const queries = mockStorage.getQueries();
    const qIndex = queries.findIndex((q) => q._id === queryId || q.id === queryId);
    if (qIndex === -1) throw new Error('Query not found');

    const newReply: Reply = {
      _id: `rep_${Date.now()}`,
      id: `rep_${Date.now()}`,
      query: queryId,
      expert: user,
      message,
      createdAt: new Date().toISOString(),
    };

    if (!queries[qIndex].replies) {
      queries[qIndex].replies = [];
    }
    queries[qIndex].replies!.push(newReply);
    queries[qIndex].status = 'Answered';
    queries[qIndex].updatedAt = new Date().toISOString();
    mockStorage.setQueries(queries);

    // Automatically notify the farmer
    const farmerId = queries[qIndex].farmer._id || queries[qIndex].farmer.id;
    if (farmerId) {
      const notifications = mockStorage.getNotifications();
      const notif: Notification = {
        _id: `notif_${Date.now()}`,
        id: `notif_${Date.now()}`,
        user: farmerId,
        message: `${user.name} replied to your query: "${queries[qIndex].title.substring(0, 40)}..."`,
        type: 'query_reply',
        link: `/queries/${queryId}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      notifications.unshift(notif);
      mockStorage.setNotifications(notifications);
    }

    return newReply;
  },

  async resolveQuery(queryId: string): Promise<Query> {
    if (!USE_MOCK) {
      return api.put(`/queries/${queryId}/resolve`);
    }
    const queries = mockStorage.getQueries();
    const qIndex = queries.findIndex((q) => q._id === queryId || q.id === queryId);
    if (qIndex === -1) throw new Error('Query not found');

    queries[qIndex].status = 'Resolved';
    queries[qIndex].updatedAt = new Date().toISOString();
    mockStorage.setQueries(queries);
    return queries[qIndex];
  },
};
