import { ToolCallProps, IChatContextService } from '@/types/server-types';
import { TOOL_HANDLER_NAME_OPTIONS } from '@/constants';
import { Bill, Budget, Expense, Fuel, Sale } from '@/types/app-types';

export interface IChatService {
  executeToolCall(toolCallProps: ToolCallProps): Promise<unknown>
}

export class ChatService implements IChatService {
  constructor(
    private billsContextService: IChatContextService<Bill>,
    private expensesContextService: IChatContextService<Expense>,
    private fuelContextService: IChatContextService<Fuel>,
    private revenuesContextService: IChatContextService<Budget>,
    private salesContextService: IChatContextService<Sale>,
  ) { }

  async executeToolCall(props: ToolCallProps): Promise<unknown> {
    if (Object.values(TOOL_HANDLER_NAME_OPTIONS.EXPENSES).includes(props.toolName)) {
      return this.expensesContextService.handleTool(props);
    }

    if (Object.values(TOOL_HANDLER_NAME_OPTIONS.REVENUES).includes(props.toolName)) {
      return this.revenuesContextService.handleTool(props);
    }

    if (Object.values(TOOL_HANDLER_NAME_OPTIONS.BILLS).includes(props.toolName)) {
      return this.billsContextService.handleTool(props);
    }

    if (Object.values(TOOL_HANDLER_NAME_OPTIONS.FUEL).includes(props.toolName)) {
      return this.fuelContextService.handleTool(props);
    }

    if (Object.values(TOOL_HANDLER_NAME_OPTIONS.SALES).includes(props.toolName)) {
      return this.salesContextService.handleTool(props);
    }
    
    throw new Error(`Unknown tool: ${props.toolName}`);
  }
}
