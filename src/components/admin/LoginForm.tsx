import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Package, Eye, EyeOff } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { Alert } from '@/components/ui/Alert';
import { LoginForm as LoginFormType } from '@/types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useTranslation } from 'react-i18next';

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set page title
  useDocumentTitle('admin.login');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>();

  const onSubmit = async (data: LoginFormType) => {
    setError(null);
    console.log('LoginForm onSubmit called with:', data);
    const result = await login(data.username, data.password);
    console.log('Login result:', result);
    
    if (result.success) {
      console.log('Login successful, navigating to /admin');
      navigate('/admin');
      console.log('Navigation called successfully');
    } else {
      console.log('Login failed:', result.error);
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Package className="h-12 w-12 text-primary-600 mx-auto" />
          <h2 className="mt-6 text-3xl font-bold text-secondary-900 dark:text-white">
            {t('admin.login')}
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            {t('admin.sign_in_to_access')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.sign_in')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert type="error" title={t('admin.login_failed')}>
                  {error}
                </Alert>
              )}

              <FormInput
                label={t('admin.username')}
                placeholder="admin"
                {...register('username', { required: t('admin.username_required') })}
                error={errors.username?.message}
                required
              />

              <div className="relative">
                <FormInput
                  label={t('admin.password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('admin.enter_password')}
                  {...register('password', { required: t('admin.password_required') })}
                  error={errors.password?.message}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
              >
                {t('admin.sign_in')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
