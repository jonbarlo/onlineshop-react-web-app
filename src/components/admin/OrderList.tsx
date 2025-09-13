import React, { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Eye, 
  Edit,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react';
import { apiService } from '@/services/api';
import { OrderStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatCurrency } from '@/config/app';
import { useTranslation } from 'react-i18next';

type SortField = 'orderNumber' | 'customerName' | 'status' | 'totalAmount' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export const OrderList: React.FC = () => {
  const { t, i18n } = useTranslation();
  // Set page title
  useDocumentTitle('admin.orders');

  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [languageKey, setLanguageKey] = useState(i18n.language);

  // Force re-render when language changes
  React.useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageKey(i18n.language);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const { data, isLoading, error } = useQuery(
    ['admin-orders', page, search, statusFilter],
    () => apiService.getAdminOrders({
      page,
      limit: 10,
      search: search || undefined,
      status: statusFilter || undefined,
    }),
    {
      keepPreviousData: true,
    }
  );

  const allOrders = data?.data || [];
  const pagination = data?.pagination;

  // Calculate total amount from order items if totalAmount is 0 or missing
  const calculateOrderTotal = (order: any) => {
    if (order.totalAmount && order.totalAmount > 0) {
      return order.totalAmount;
    }
    
    // Calculate from items if totalAmount is 0 or missing
    if (order.items && Array.isArray(order.items)) {
      return order.items.reduce((total: number, item: any) => {
        return total + (item.quantity * item.unitPrice);
      }, 0);
    }
    
    return 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Client-side search and sorting
  const orders = useMemo(() => {
    let filtered = [...allOrders];

    // Apply search filter if search term exists
    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      filtered = filtered.filter((order) => {
        // Search across multiple fields
        const orderNumber = order.orderNumber?.toLowerCase() || '';
        const customerName = order.customerName?.toLowerCase() || '';
        const customerEmail = order.customerEmail?.toLowerCase() || '';
        const status = order.status?.toLowerCase() || '';
        const totalAmount = calculateOrderTotal(order).toString();
        const createdAt = formatDate(order.createdAt).toLowerCase();

        return (
          orderNumber.includes(searchTerm) ||
          customerName.includes(searchTerm) ||
          customerEmail.includes(searchTerm) ||
          status.includes(searchTerm) ||
          totalAmount.includes(searchTerm) ||
          createdAt.includes(searchTerm)
        );
      });
    }

    // Apply sorting
    const sorted = filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle different data types
      if (sortField === 'totalAmount') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [allOrders, search, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 opacity-30" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-primary-600" /> : 
      <ChevronDown className="h-4 w-4 text-primary-600" />;
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return 'bg-warning-100 text-warning-800';
      case 'paid':
        return 'bg-success-100 text-success-800';
      case 'ready_for_delivery':
        return 'bg-secondary-100 text-secondary-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" title={t('admin.failed_to_load_orders')}>
        {t('admin.unable_to_load_orders')}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 key={languageKey} className="text-3xl font-bold text-secondary-900 dark:text-white">{t('admin.orders')}</h1>
        <p key={languageKey} className="text-secondary-600">{t('admin.manage_orders_subtitle')}</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <Input
                  key={languageKey}
                  placeholder={t('admin.search_orders')}
                  value={search}
                  onChange={setSearch}
                  className="pl-10 pr-10"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400 hover:text-secondary-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="sm:w-48">
              <select
                key={languageKey}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
                className="input w-full"
              >
                <option value="">{t('admin.all_status')}</option>
                <option value="new">{t('admin.new')}</option>
                <option value="paid">{t('admin.paid')}</option>
                <option value="ready_for_delivery">{t('admin.ready_for_delivery')}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div key={languageKey} className="text-sm font-medium text-secondary-600">
              {search ? t('admin.filtered_orders', { filtered: orders.length, total: allOrders.length }) : t('admin.total_orders')}
            </div>
            <div className="text-2xl font-bold text-secondary-900">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div key={languageKey} className="text-sm font-medium text-secondary-600">{t('admin.total_revenue')}</div>
            <div className="text-2xl font-bold text-secondary-900">
              {formatCurrency(allOrders.reduce((total, order) => total + calculateOrderTotal(order), 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div key={languageKey} className="text-sm font-medium text-secondary-600">{t('admin.average_order_value')}</div>
            <div className="text-2xl font-bold text-secondary-900">
              {allOrders.length > 0 ? formatCurrency(allOrders.reduce((total, order) => total + calculateOrderTotal(order), 0) / allOrders.length) : formatCurrency(0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50">
                  <tr>
                    <th 
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-secondary-100 select-none ${
                        sortField === 'orderNumber' ? 'text-primary-600 bg-primary-50' : 'text-secondary-500'
                      }`}
                      onClick={() => handleSort('orderNumber')}
                    >
                      <div className="flex items-center space-x-1 group">
                        <span key={languageKey} className="group-hover:text-primary-600">{t('admin.order')}</span>
                        {getSortIcon('orderNumber')}
                      </div>
                    </th>
                    <th 
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-secondary-100 select-none ${
                        sortField === 'customerName' ? 'text-primary-600 bg-primary-50' : 'text-secondary-500'
                      }`}
                      onClick={() => handleSort('customerName')}
                    >
                      <div className="flex items-center space-x-1 group">
                        <span key={languageKey} className="group-hover:text-primary-600">{t('admin.customer')}</span>
                        {getSortIcon('customerName')}
                      </div>
                    </th>
                    <th 
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-secondary-100 select-none ${
                        sortField === 'status' ? 'text-primary-600 bg-primary-50' : 'text-secondary-500'
                      }`}
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center space-x-1 group">
                        <span key={languageKey} className="group-hover:text-primary-600">{t('admin.status')}</span>
                        {getSortIcon('status')}
                      </div>
                    </th>
                    <th 
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-secondary-100 select-none ${
                        sortField === 'totalAmount' ? 'text-primary-600 bg-primary-50' : 'text-secondary-500'
                      }`}
                      onClick={() => handleSort('totalAmount')}
                    >
                      <div className="flex items-center space-x-1 group">
                        <span key={languageKey} className="group-hover:text-primary-600">{t('admin.total')}</span>
                        {getSortIcon('totalAmount')}
                      </div>
                    </th>
                    <th 
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-secondary-100 select-none ${
                        sortField === 'createdAt' ? 'text-primary-600 bg-primary-50' : 'text-secondary-500'
                      }`}
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center space-x-1 group">
                        <span key={languageKey} className="group-hover:text-primary-600">{t('admin.date')}</span>
                        {getSortIcon('createdAt')}
                      </div>
                    </th>
                    <th key={languageKey} className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      {t('admin.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-secondary-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-secondary-900">
                          {order.orderNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-secondary-900">
                            {order.customerName}
                          </div>
                          <div className="text-sm text-secondary-500">
                            {order.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {formatCurrency(calculateOrderTotal(order))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/orders/${order.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary-600">
                {search ? `No orders found matching "${search}"` : 'No orders found'}
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="mt-2 text-primary-600 hover:text-primary-700 underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary-700">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
            {pagination.totalItems} results
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
