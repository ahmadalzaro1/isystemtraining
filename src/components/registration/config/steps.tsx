
import { UserTypeStep } from "../UserTypeStep";
import { MainTasksStep } from "../MainTasksStep";
import { LearningStylesStep } from "../LearningStylesStep";
import { WorkshopTopicsStep } from "../WorkshopTopicsStep";
import { ContactStep } from "../ContactStep";

export type StepComponent = {
  id: string;
  title: string;
  description: string;
  Component: React.ComponentType<any>;
};

export const REGISTRATION_STEPS: StepComponent[] = [
  {
    id: 'user-type',
    title: "Your Apple Experience",
    description: "Tell us about your experience with Apple devices",
    Component: UserTypeStep,
  },
  {
    id: 'main-tasks',
    title: "Main Tasks",
    description: "What do you primarily use your Apple devices for?",
    Component: MainTasksStep,
  },
  {
    id: 'learning-style',
    title: "Learning Style",
    description: "How do you prefer to learn new features?",
    Component: LearningStylesStep,
  },
  {
    id: 'workshop-topics',
    title: "Workshop Topics",
    description: "What topics interest you for future workshops?",
    Component: WorkshopTopicsStep,
  },
  {
    id: 'contact',
    title: "Contact Details",
    description: "How should we keep in touch?",
    Component: ContactStep,
  },
];
