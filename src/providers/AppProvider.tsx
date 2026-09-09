import { ConfirmModal, confirmModalRef } from '@/components/modals/CustomConfirmModal';
import { toastConfig } from '@/components/toasts/CustomToast';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import Toast from 'react-native-toast-message';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AppRoutes } from '../routes/AppRoutes';
import { AuthRoutes } from '../routes/AuthRoutes';


function NavigationConsumer() {
        const { user, loading } = useAuth();

        if (loading) return <LoadingIndicator message="Carregando..." />;

        return user ? <AppRoutes /> : <AuthRoutes />;
}

export function AppProvider() {
        return (
                <AuthProvider>
                        <NavigationConsumer />
                        <ConfirmModal ref={confirmModalRef} />
                        <Toast config={toastConfig} />
                </AuthProvider>
        );
}