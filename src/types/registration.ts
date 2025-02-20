
export interface FormData {
  experience: string;
  name: string;
  email: string;
  phone: string;
  contactMethod: string;
  occupation: string;
  devices: string[];
}

export interface RegistrationFormProps {
  onComplete: (data: FormData) => void;
}
