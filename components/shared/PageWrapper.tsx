import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import MonthYearSelector from './MonthYearSelector';

interface PageWrapperProps {
    title: string;
    addItem?: string;
    children?: React.ReactNode;
    setAddModalOpen?: (open: boolean) => void;
    secondaryActions?: React.ReactNode;
}

export const PageWrapper = ({ title, addItem, setAddModalOpen, children, secondaryActions }: PageWrapperProps) => {
    return (
        <div className="space-y-6">
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                <h1 className='text-2xl font-bold'>{title}</h1>
                <div className='flex items-center justify-between sm:justify-end gap-3'>
                <MonthYearSelector />
                {secondaryActions}
                {setAddModalOpen && (
                    <Button size='sm' onClick={() => setAddModalOpen(true)}>
                        <Plus size={16} />
                        <span className='hidden sm:inline ml-1'>{addItem || 'Novo Item'}</span>
                    </Button>
                )}
                </div>
            </div>
            {children}
        </div>
    )
}