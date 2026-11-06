export type Designation = 'CL' | 'ACL';

export interface Representative {
  id: string;
  name: string;
  designation: Designation;
  phone: string;
  email: string;
}

export interface CollegeFormData {
  collegeName: string;
  collegeCity: string;
  representatives: Representative[];
  consent: boolean;
}

export interface RepresentativeError {
  name?: string;
  phone?: string;
  email?: string;
}

export interface FormValidationErrors {
  collegeName?: string;
  collegeCity?: string;
  representatives?: { [index: number]: RepresentativeError };
  duplicates?: string;
  consent?: string;
}

export interface SubmittedRegistration {
  referenceId: string;
  collegeName: string;
  collegeCity: string;
  representatives: Representative[];
  submittedAt: string;
}

export interface CollegeOption {
  name: string;
  city: string;
}
