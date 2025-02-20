
export interface FormData {
  experience: string;
  name: string;
  email: string;
  phone: string;
  contactMethod: string;
  occupation: string;
  devices: string[];
  learningInterests: string[];
}

export interface RegistrationFormProps {
  onComplete: (data: FormData) => void;
}

export interface Workshop {
  id: string;
  name: string;
  date: Date;
  time: string;
  description: string;
  spotsRemaining: number;
}
