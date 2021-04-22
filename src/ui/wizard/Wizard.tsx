import React, { ReactChild, useContext, useEffect, useState } from 'react';

import isEqual from 'react-fast-compare';

interface Step<Data = unknown> {
  position: number;
  data: Data;

  name?: string;
}

type PossibleStep = Step | null;

type StepElement = Step & { component: any }

interface IWizardContextData<D = unknown> {
  currentStep: Step | undefined;

  data: D;

  previous(): PossibleStep;

  next(): PossibleStep;
}

interface IWizardContextActions {
  goTo(step: number): void;

  goToId(stepId: string): void;

  goToPrevious(): void;

  goToNext(data?: any): void;

  setCurrentStepData<T = unknown>(data: T): void;

  finish(): void;
}

const WizardContextData = React.createContext<IWizardContextData>({
  currentStep: undefined,

  data: undefined,

  previous(): PossibleStep {
    return null
  },
  next(): PossibleStep {
    return null
  }
});

const WizardContextActions = React.createContext<IWizardContextActions>({
  goTo(step: number) {
  },
  goToId(stepId: string) {
  },
  goToPrevious() {
  },
  goToNext(data: any) {
  },

  setCurrentStepData() {
  },
  finish() {
  }
})

interface Props {
  children: Array<any>;

  onFinish?(wizardData: any): Promise<boolean>;
}

const Wizard = ({ children, onFinish }: Props) => {
  const [{
    currentStep,
    steps,
    wizardData
  }, setWizardState] = useState<{ currentStep: StepElement | undefined; steps: Array<StepElement>; wizardData: any }>(() => {
    const steps = React.Children.map<StepElement, ReactChild>(children, (child, step) => {
      if (typeof child === 'string' || typeof child === 'number') {
        throw new Error('Wizard child should be a ReactElement');
      }

      return {
        component: child,
        position: step,
        name: child.props.name || step,
        data: {}
      };
    });

    return {
      currentStep: steps[0],
      steps,
      wizardData: {}
    };
  });

  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished && onFinish) {
      if (!onFinish(wizardData)) {
        setFinished(false);
      }
    }
  }, [finished, currentStep, wizardData, onFinish]);

  const FIRST_STEP = 0;
  const LAST_STEP = steps.length - 1;

  const setCurrentStepData = (data: any) => {
    if (!currentStep) {
      return;
    }

    if (isEqual(data, currentStep.data)) {
      console.log('Current component data is the same. skip update');

      return;
    }

    setWizardState(prev => {
      const updatedSteps = prev.steps.map(step => {
        if (step.position === currentStep.position) {
          return {
            ...step,
            data
          }
        }

        return step;
      });

      return ({
        wizardData: {
          ...prev.wizardData,
          ...data
        },
        steps: updatedSteps,
        currentStep: {
          ...prev.currentStep!,
          data
        }
      })
    })
  }

  const goTo = (step: number) => {
    if (step < FIRST_STEP || step > LAST_STEP) {
      console.warn('Invalid step');

      return;
    }

    if (!currentStep || currentStep.position === step) {
      return;
    }

    setWizardState(prev => ({
      ...prev,
      currentStep: steps[step]
    }));
  }

  const goToId = (stepId: string) => {
    if (!currentStep || currentStep.name === stepId) {
      return;
    }

    const step = steps.find(s => s.name === stepId);

    if (step) {
      console.warn(`Step with id ${stepId} doesn't exist`);

      return;
    }

    return setWizardState(prev => ({
      ...prev,
      currentStep: step
    }))
  }

  const previous = (): PossibleStep => {
    if (!currentStep || currentStep.position === FIRST_STEP) {
      return null;
    }

    return steps[currentStep.position - 1];
  }

  const next = (): PossibleStep => {
    if (!currentStep || currentStep.position === LAST_STEP) {
      return null;
    }

    return steps[currentStep.position + 1];
  }

  const goToNext = (_data?: any) => {
    if (!currentStep || currentStep.position === LAST_STEP) {
      console.error('This is the last component.');

      return;
    }

    setWizardState(prev => ({
      ...prev,
      currentStep: steps[currentStep.position + 1]
    }));
  }

  const goToPrevious = () => {
    if (!currentStep || currentStep.position === FIRST_STEP) {
      console.error('This is the first component.');

      return;
    }

    setWizardState(prev => ({
      ...prev,
      currentStep: steps[currentStep.position - 1]
    }));
  }

  const finish = () => {
    setFinished(true);
  }

  const data: IWizardContextData = {
    currentStep,
    next,
    data: wizardData,
    previous,
  };

  const actions: IWizardContextActions = {
    goTo,
    goToId,
    goToPrevious,
    goToNext,
    setCurrentStepData,
    finish
  };

  return <WizardContextData.Provider value={data}>
    <WizardContextActions.Provider value={actions}>
      {(currentStep && React.cloneElement(currentStep.component, { data: currentStep.data })) || 'No steps provided'}
    </WizardContextActions.Provider>
  </WizardContextData.Provider>
};

export function useWizardData<T>(): IWizardContextData<T> {
  const ctx = useContext(WizardContextData);

  return ctx.data as IWizardContextData<T>;
}

export function useCurrentStep<T>(): Step<T> {
  const ctx = useContext(WizardContextData);

  return ctx.currentStep as Step<T>;
}

export function useNextStep(): PossibleStep {
  const ctx = useContext(WizardContextData);

  return ctx.next();
}

export function usePreviousStep(): PossibleStep {
  const ctx = useContext(WizardContextData);

  return ctx.previous();
}

export function useWizardActions(): IWizardContextActions {
  return useContext(WizardContextActions);
}

interface IWizard {

}

export function useWizard(): IWizard {
  return {
    ...useWizardActions(),
    currentStep: useCurrentStep()
  };
}

export default Wizard;
