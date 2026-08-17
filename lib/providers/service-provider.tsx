import { Budget, Expense, Fuel, Sale } from '@/types/app-types';
import { IFullTableCrudService, ITableCrudService } from '@/types/server-types';
import { createContext, PropsWithChildren, useContext } from 'react';
import { 
    BillsService, 
    ExpensesService, 
    FuelService, 
    IBillsService,
    IUserService, 
    RevenuesService, 
    SalesService, 
    UserService
} from '../db';

interface ServiceContextProps {
    billsService: IBillsService;
    expensesService: IFullTableCrudService<Expense>;
    fuelService: IFullTableCrudService<Fuel>;
    revenuesService: IFullTableCrudService<Budget>;
    salesService: ITableCrudService<Sale>;
    userService: IUserService;
}

const defaultContextValue = {
    billsService: new BillsService(),
    expensesService: new ExpensesService(),
    fuelService: new FuelService(),
    revenuesService: new RevenuesService(),
    salesService: new SalesService(),
    userService: new UserService(),
};

export const ServiceContext = createContext<ServiceContextProps>(defaultContextValue);

export function ServiceProvider({ children }: PropsWithChildren<{}>) {
    return (
        <ServiceContext.Provider
            value={defaultContextValue}
        >
            {children}
        </ServiceContext.Provider>
    )
}

export function useService() {
  return useContext(ServiceContext);
}