
import { BasicProfileStep } from "../BasicProfileStep";
import { PlatformStep } from "../PlatformStep";
import { LearningNeedsStep } from "../LearningNeedsStep";
import { ConfidenceStep } from "../ConfidenceStep";
import { ContactStep } from "../ContactStep";

export type StepComponent = {
  id: string;
  title: string;
  description: string;
  Component: React.ComponentType<any>;
};

export const REGISTRATION_STEPS: StepComponent[] = [
  {
    id: 'basic-profile',
    title: "Your Apple Experience",
    description: "Tell us about your experience with Apple devices",
    Component: BasicProfileStep,
  },
  {
    id: 'platform',
    title: "Platform Switch",
    description: "Are you switching from another platform?",
    Component: PlatformStep,
  },
  {
    id: 'learning',
    title: "Learning Needs",
    description: "What would you like to learn?",
    Component: LearningNeedsStep,
  },
  {
    id: 'confidence',
    title: "Experience & Challenges",
    description: "Help us understand your current comfort level",
    Component: ConfidenceStep,
  },
  {
    id: 'contact',
    title: "Contact Details",
    description: "How should we keep in touch?",
    Component: ContactStep,
  },
];
