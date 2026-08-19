import { BillsService } from '@/lib/actions/services';

export function useServices() {
    return {    
        billsService: new BillsService(),
    };
}