
import { ExperienceStep } from "../ExperienceStep";
import { PersonalInfoStep } from "../PersonalInfoStep";
import { DevicesStep } from "../DevicesStep";
import { OccupationStep } from "../OccupationStep";
import { LearningInterestsStep } from "../LearningInterestsStep";

export type StepComponent = {
  id: string;
  title: string;
  description: string;
  Component: React.ComponentType<any>;
  showIf?: (experience: string) => boolean;
};

export const REGISTRATION_STEPS: StepComponent[] = [
  {
    id: 'experience',
    title: "Experience Level",
    description: "Tell us about your experience with Apple products",
    Component: ExperienceStep,
  },
  {
    id: 'personal',
    title: "Personal Information",
    description: "Enter your contact details",
    Component: PersonalInfoStep,
  },
  {
    id: 'occupation',
    title: "Your Occupation",
    description: "Tell us about your professional background",
    Component: OccupationStep,
  },
  {
    id: 'devices',
    title: "Your Devices",
    description: "Select the Apple devices you own",
    Component: DevicesStep,
    showIf: (experience: string) => experience !== "first-time",
  },
  {
    id: 'interests',
    title: "Learning Interests",
    description: "What would you like to learn about in future workshops?",
    Component: LearningInterestsStep,
  },
];
