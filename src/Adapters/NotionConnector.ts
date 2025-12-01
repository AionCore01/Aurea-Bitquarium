// src/Adapters/NotionConnector.ts

import { Client } from '@notionhq/client';
import { ITaskCompletion, WorkState } from '../Model/WorkState';
import { EventLogger } from '../Events/EventLogger';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
    EventLogger.getInstance().handleError(
        'NOTION_SETUP_ERROR', 
        'Faltan NOTION_TOKEN o NOTION_DATABASE_ID en el archivo .env.'
    );
}

const notion = new Client({ auth: NOTION_TOKEN });

export class NotionConnector {
    private workState: WorkState;

    constructor(workState: WorkState) {
        this.workState = workState;
    }

    public async auditAndNotify(): Promise<number> {
        if (!NOTION_DATABASE_ID) return 0;

        try {
            const response = await notion.databases.query({
                database_id: NOTION_DATABASE_ID,
                filter: {
                    property: 'Estado',
                    status: {
                        equals: 'Auditable'
                    }
                },
                sorts: [
                    {
                        property: 'Última Edición',
                        direction: 'descending',
                    },
                ],
                page_size: 10
            });

            let completedCycles = 0;
            
            for (const page of response.results) {
                const props = (page as any).properties;
                
                // Mapeo exacto a tu estructura
                const taskId = props.Tarea?.title?.[0]?.plain_text || page.id;
                const valueGenerated = props['Valor (USD)']?.number || 0;
                const timeSpentHours = props.Horas?.number || 0;

                const taskCompletion: ITaskCompletion = {
                    taskId,
                    timeSpentHours,
                    valueGenerated,
                    registrationLatencyMs: props['Latencia (ms)']?.number || 0
                };

                this.workState.completeTaskCycle(taskCompletion);
                completedCycles++;
            }
            
            return completedCycles;

        } catch (error) {
            EventLogger.getInstance().handleError('NOTION_API_FAILURE', error);
            return 0;
        }
    }
}