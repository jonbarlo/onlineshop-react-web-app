import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types';
import { apiService } from '@/services/api';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Input } from '@/components/ui/Input';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Loader2
} from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useTranslation } from 'react-i18next';

export const AdminCategories: React.FC = () => {
  const { t, i18n } = useTranslation();
  // Set page title
  useDocumentTitle('admin.categories');

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
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

  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categoriesData, isLoading, error } = useQuery(
    ['categories'],
    () => apiService.getCategories(),
    {
      refetchOnWindowFocus: false,
    }
  );

  // Debug logging
  console.log('Categories data:', categoriesData);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);

  // Create category mutation
  const createMutation = useMutation(
    (data: CreateCategoryRequest) => apiService.createCategory(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories']);
        setShowForm(false);
      },
    }
  );

  // Update category mutation
  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: UpdateCategoryRequest }) => 
      apiService.updateCategory(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories']);
        setEditingCategory(undefined);
        setShowForm(false);
      },
    }
  );

  // Delete category mutation
  const deleteMutation = useMutation(
    (id: string) => apiService.deleteCategory(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories']);
      },
    }
  );

  const categories = categoriesData?.data || [];
  console.log('Categories array:', categories);

  // Filter categories
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingCategory(undefined);
    setShowForm(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (category: Category) => {
    console.log('Category object:', category);
    console.log('Category _id:', category.id);
    console.log('Category id (if exists):', (category as any).id);
    
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      try {
        // Use _id if available, otherwise try id
        const categoryId = category.id || (category as any).id;
        if (!categoryId) {
          console.error('No category ID found:', category);
          alert('Error: Category ID not found');
          return;
        }
        await deleteMutation.mutateAsync(categoryId);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      // Use _id if available, otherwise try id
      const categoryId = category.id || (category as any).id;
      if (!categoryId) {
        console.error('No category ID found for toggle:', category);
        alert('Error: Category ID not found');
        return;
      }
      await updateMutation.mutateAsync({
        id: categoryId,
        data: { isActive: !category.isActive }
      });
    } catch (error) {
      console.error('Error updating category status:', error);
    }
  };

  const handleSave = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    if (editingCategory) {
      // Use _id if available, otherwise try id
      const categoryId = editingCategory.id;
      if (!categoryId) {
        console.error('No category ID found for save:', editingCategory);
        alert('Error: Category ID not found');
        return;
      }
      await updateMutation.mutateAsync({ id: String(categoryId), data });
    } else {
      await createMutation.mutateAsync(data as CreateCategoryRequest);
    }
  };

  if (showForm) {
    return (
      <div className="p-6">
        <CategoryForm
          category={editingCategory}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(undefined);
          }}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 key={languageKey} className="text-3xl font-bold text-gray-900 dark:text-white">{t('admin.categories')}</h1>
          <p key={languageKey} className="text-gray-600 dark:text-gray-400 mt-1">
            {t('admin.manage_categories_subtitle')}
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('admin.add_category')}
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              key={languageKey}
              placeholder={t('admin.search_categories')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Alert type="error">
          {t('admin.failed_to_load_categories')}
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle key={languageKey}>{t('admin.categories_count', { count: filteredCategories.length })}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">{t('admin.loading_categories')}</span>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                {searchTerm ? t('admin.no_categories_match_search') : t('admin.no_categories_found')}
              </div>
              {!searchTerm && (
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('admin.create_first_category')}
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th key={languageKey} className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t('admin.name')}
                    </th>
                    <th key={languageKey} className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t('admin.description')}
                    </th>
                    <th key={languageKey} className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t('admin.sort_order')}
                    </th>
                    <th key={languageKey} className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t('admin.status')}
                    </th>
                    <th key={languageKey} className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t('admin.created')}
                    </th>
                    <th key={languageKey} className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t('admin.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {category.image && (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-8 h-8 rounded object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {category.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              /{category.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        {category.description || '-'}
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        {category.sortOrder || 0}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          category.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400 text-sm">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(category)}
                            disabled={updateMutation.isLoading}
                          >
                            {category.isActive ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category)}
                            disabled={deleteMutation.isLoading}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
