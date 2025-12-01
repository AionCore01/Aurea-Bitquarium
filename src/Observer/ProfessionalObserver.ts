// src/Observer/ProfessionalObserver.ts

import { IObserver } from './IObserver';
import { ISubject } from './ISubject';
import { WorkState, ITaskCompletion } from '../Model/WorkState';
import { AionEventEmitter } from '../Events/AionEventEmitter';
import { IEvent, EventType } from '../Events/IEvent';

export class ProfessionalObserver implements IObserver {
  
  public update(subject: ISubject): void {
    if (subject instanceof WorkState) {
      
      const lastTask = subject.currentTasks[subject.currentTasks.length - 1];
      if (!lastTask) return;

      console.log(`ProfessionalObserver: Detectado ciclo de trabajo para la tarea ${lastTask.taskId}.`);

      // Emitir un evento de auditoría profesional usando el emisor AION
      AionEventEmitter.getInstance().emit(
        'ProfessionalObserver', // source
        EventType.Audit, // type
        { // payload
          message: `Rendimiento profesional auditado.`,
          taskId: lastTask.taskId,
          timeSpentHours: lastTask.timeSpentHours,
          valueGenerated: lastTask.valueGenerated,
          systemStatus: subject.healthStatus,
          workHash: subject.totalValueGeneratedHash
        }
      );
      
      console.log(`ProfessionalObserver: Evento de auditoría AION emitido para ${lastTask.taskId}.`);
    }
  }
}
